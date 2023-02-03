import { defineTool } from './'
import { readJson } from '../utils'

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

    const config = (await readJson(configPath)) as string[]

    if (!Array.isArray(config)) {
      ctx.log(new Error('invalid config file'))
      process.exit(1)
    }

    await ctx.execute([...config, ...ctx.args])
  },
})
