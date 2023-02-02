import eslint from './eslint'
import husky from './husky'
import lintStaged from './lint-staged'
import prettier from './prettier'
import jest from './jest'
import tsup from './tsup'
import install from './internal/install'
import esbuild from './esbuild'
import webpack from './webpack'

export interface ITool {
  name: string
  run: (ctx: IToolContext) => Promise<void> | void
}

export interface IToolContext {
  readonly mode?: string
  readonly args: readonly string[]
  readonly find: (
    tag: string,
    pattern: string | string[],
  ) => Promise<string | undefined>
  // relative path
  readonly resolve: (tag: string, path?: string) => string
  readonly execute: (args: readonly string[]) => Promise<void>
  readonly log: {
    (msg: string): void
    (error: Error): void
    (tag: string, content: string): void
  }
}

const TOOLS = collectTools(
  esbuild,
  eslint,
  husky,
  install,
  jest,
  lintStaged,
  prettier,
  tsup,
  webpack,
)

function collectTools(...tools: ITool[]) {
  const o = Object.create(null) as Record<string, ITool>
  for (const tool of tools) {
    o[tool.name] = tool
  }
  return o
}

export function getTool(name: string): ITool | undefined {
  return TOOLS[name]
}

export function defineTool(t: ITool) {
  return t
}
