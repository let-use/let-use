import { defineTool } from './'
import { readFile } from 'node:fs/promises'
import chalk from 'chalk'

export default defineTool({
  name: 'esbuild',
  async run(ctx) {
    const configPath = await ctx.find('config', [
      'esbuild.json',
      'esbuild.config.json',
    ])

    if (!configPath) {
      // call esbuild directly
      await ctx.execute(ctx.args)
      return
    }

    const config = JSON.parse(
      await readFile(configPath, 'utf-8'),
    ) as EsbuildConfig

    let name, args
    if (ctx.args[0].startsWith('@')) {
      ;[name, ...args] = ctx.args
      name = name.slice(1)
    } else {
      name = config.default
      args = ctx.args
    }

    const modeArgs = config[name]

    if (!modeArgs || !Array.isArray(modeArgs)) {
      process.stderr.write(
        `${chalk.red(`mode "${chalk.bold(name || 'default')}" is invalid`)}\n`,
      )
      process.exit(1)
    }

    await ctx.execute([...modeArgs, ...args])
  },
})

type EsbuildConfig = {
  default: string
} & {
  [name: string]: string[]
}
