import { default as fg } from 'fast-glob'
import { default as chalk } from 'chalk'
import { join, relative } from 'node:path'
import { getTool, IToolContext } from './tools'
import { mkdir } from 'node:fs/promises'
import { spawnAsync } from './utils'
import fallback from './tools/internal/fallback'

const USE_DIR = join(process.cwd(), '.use')

export async function runTool(name: string | undefined, args: string[]) {
  if (!name) {
    process.stderr.write(chalk.red('no tool specified'))
    process.exit(1)
  }
  process.stderr.write(formatCmd([name, ...args].join(' ')))
  const ctx = createToolContext(name, args)
  const tool = getTool(name) ?? fallback
  await tool.run(ctx)
}

function createToolContext(name: string, args: string[]): IToolContext {
  const find = createFind()
  const resolve = createResolve()
  const execute = createExecute(name)
  return {
    args,
    find,
    resolve,
    execute,
  }
}

function createFind(): IToolContext['find'] {
  return async (tag, p) => {
    const results = await fg(p, {
      absolute: true,
      dot: true,
      cwd: USE_DIR,
    })
    const path = results[0]

    if (path) {
      print(tag, chalk.green(relative(process.cwd(), path)))
      return path
    }
    print(tag, chalk.gray('none'))
  }
}

function createResolve(): IToolContext['resolve'] {
  return (tag, path) => {
    const dir = path ? join(USE_DIR, path) : USE_DIR
    const result = relative(process.cwd(), dir)
    print(tag, chalk.green(result))
    return result
  }
}

function createExecute(name: string): IToolContext['execute'] {
  const ensureDir = mkdir(USE_DIR, {
    recursive: true,
  })
  return async (args) => {
    await ensureDir
    const exitCode = await spawnAsync('npm', [
      'exec',
      '--prefix',
      USE_DIR,
      name,
      '--',
      ...args,
    ])
    if (exitCode) {
      process.exit(exitCode)
    }
  }
}

function print(tag: string, content: string) {
  const pad = ' '.repeat(Math.max(8 - tag.length, 0))
  process.stderr.write(`→ ${chalk.underline.bold(tag)}${pad} ${content}\n`)
}

const reservedWords = [
  'if',
  'then',
  'else',
  'elif',
  'fi',
  'case',
  'esac',
  'for',
  'select',
  'while',
  'until',
  'do',
  'done',
  'in',
]

// copy from zx
// see https://github.com/google/zx/blob/79222d7ee/src/util.ts#L237
function formatCmd(cmd?: string): string {
  if (cmd == undefined) return chalk.grey('undefined')
  const chars = [...cmd]
  let out = '$ '
  let buf = ''
  let ch: string
  type State = (() => State) | undefined
  let state: State = root
  let wordCount = 0
  while (state) {
    ch = chars.shift() || 'EOF'
    if (ch == '\n') {
      out += style(state, buf) + '\n> '
      buf = ''
      continue
    }
    const next: State = ch == 'EOF' ? undefined : state()
    if (next != state) {
      out += style(state, buf)
      buf = ''
    }
    state = next == root ? next() : next
    buf += ch
  }

  function style(state: State, s: string): string {
    if (s == '') return ''
    if (reservedWords.includes(s)) {
      return chalk.cyan(s)
    }
    if (state == word && wordCount == 0) {
      wordCount++
      return chalk.green(s)
    }
    if (state == syntax) {
      wordCount = 0
      return chalk.cyan(s)
    }
    if (state == dollar) return chalk.yellow(s)
    if (state?.name.startsWith('str')) return chalk.yellow(s)
    return s
  }

  function isSyntax(ch: string) {
    return '()[]{}<>;:+|&='.includes(ch)
  }

  function root() {
    if (/\s/.test(ch)) return space
    if (isSyntax(ch)) return syntax
    if (/[$]/.test(ch)) return dollar
    if (/["]/.test(ch)) return strDouble
    if (/[']/.test(ch)) return strSingle
    return word
  }

  function space() {
    if (/\s/.test(ch)) return space
    return root
  }

  function word() {
    if (/[0-9a-z/_.]/i.test(ch)) return word
    return root
  }

  function syntax() {
    if (isSyntax(ch)) return syntax
    return root
  }

  function dollar() {
    if (/[']/.test(ch)) return str
    return root
  }

  function str() {
    if (/[']/.test(ch)) return strEnd
    if (/[\\]/.test(ch)) return strBackslash
    return str
  }

  function strBackslash() {
    return strEscape
  }

  function strEscape() {
    return str
  }

  function strDouble() {
    if (/["]/.test(ch)) return strEnd
    return strDouble
  }

  function strSingle() {
    if (/[']/.test(ch)) return strEnd
    return strSingle
  }

  function strEnd() {
    return root
  }

  return out + '\n'
}
