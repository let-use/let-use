import { defineTool } from '../'
import { readFile } from 'node:fs/promises'
import { spawnAsync } from '../../utils'
import chalk from 'chalk'

export default defineTool({
  name: 'install',
  async run(ctx) {
    const storePath = ctx.resolve('store')

    const depJsonPath = await ctx.find('deps', ['dependencies.json'])

    if (!depJsonPath) {
      return
    }

    const depsJson = (await JSON.parse(
      await readFile(depJsonPath, 'utf-8'),
    )) as IDepsJson

    const deps: [name: string, version: string][] = []

    Object.values(depsJson).forEach((group) => {
      Object.entries(group).forEach((entry) => {
        deps.push(entry)
      })
    })

    process.stderr.write(
      `${chalk.blue(`Installing ${deps.length} packages:`)}\n`,
    )
    deps.forEach(([name, version]) => {
      process.stderr.write(`  ${chalk.bold(name)}: ${chalk.green(version)}\n`)
    })

    // use npm because pnpm doesn't support --no-save and --prefix
    await spawnAsync('npm', [
      'install',
      '--no-save',
      '--no-fund',
      '--no-audit',
      '--prefix',
      storePath,
      ...deps.map(([name, version]) => `${name}@${version}`),
    ])
  },
})

interface IDepsJson {
  [groupName: string]: {
    [depName: string]: string
  }
}
