import { defineTool } from './'

export default defineTool({
  name: 'vite',
  async run(ctx) {
    const mode = ctx.mode

    // https://vitejs.dev/config/#configuring-vite
    const config = await ctx.find(
      'config',
      mode ? [`vite.config.${mode}.+(js|ts)`] : ['vite.config.+(js|ts)'],
    )

    const args = tryAddConfigPath(ctx.args, config)

    await ctx.execute(args)
  },
})

function tryAddConfigPath(args: readonly string[], configPath?: string) {
  if (!configPath) return args
  // https://vitejs.dev/guide/cli.html
  switch (args[0]) {
    case 'build':
    case 'optimize':
    case 'preview':
      return [args[0], '--config', configPath, ...args.slice(1)]
    default:
      return ['--config', configPath, ...args]
  }
}
