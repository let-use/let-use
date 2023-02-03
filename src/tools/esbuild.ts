import { defineTool } from './'
import { readFile } from 'node:fs/promises'

export default defineTool({
  name: 'esbuild',
  async run(ctx) {
    const mode = ctx.mode

    const configPath = await ctx.find(
      'config',
      mode
        ? [`esbuild.${mode}.json`, `esbuild.config.${mode}.json`]
        : ['esbuild.json', 'esbuild.config.json'],
    )

    if (!configPath) {
      // call esbuild directly
      await ctx.execute(ctx.args)
      return
    }

    const config = JSON.parse(await readFile(configPath, 'utf-8')) as string[]

    if (!Array.isArray(config)) {
      ctx.log(new Error('invalid config file'))
      process.exit(1)
    }

    await ctx.execute([...config, ...ctx.args])
  },
})
