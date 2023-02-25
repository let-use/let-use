import { defineTool } from './'

export default defineTool({
  name: 'vitest',
  async run(ctx) {
    const mode = ctx.mode

    // https://vitest.dev/config/#configuration
    const config = await ctx.find(
      'config',
      mode
        ? [`vitest.config.${mode}.(js|ts)`, `vite.config.${mode}.(js|ts)`]
        : ['vitest.config.(js|ts)', 'vite.config.(js|ts)'],
    )

    const args = tryAddConfigPath(ctx.args, config)

    await ctx.execute(args)
  },
})

function tryAddConfigPath(args: readonly string[], configPath?: string) {
  if (!configPath) return args
  // https://vitest.dev/guide/cli.html#commands
  switch (args[0]) {
    case 'run':
    case 'watch':
    case 'dev':
    case 'related':
      // https://vitest.dev/guide/cli.html#options
      return [args[0], '--config', configPath, ...args.slice(1)]
    default:
      // ditto
      return ['--config', configPath, ...args]
  }
}
