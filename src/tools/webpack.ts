import { defineTool } from './'

export default defineTool({
  name: 'webpack',
  async run(ctx) {
    const mode = ctx.mode

    // https://webpack.js.org/api/cli/#default-configurations
    const config = await ctx.find(
      'config',
      mode
        ? [`webpack.${mode}.js`, `webpack.config.${mode}.js`]
        : ['webpack.js', 'webpack.config.js'],
    )

    const args = tryAddConfigPath(ctx.args, config)

    await ctx.execute(args)
  },
})

function tryAddConfigPath(args: readonly string[], configPath?: string) {
  if (!configPath) return args
  // https://webpack.js.org/api/cli/#commands
  switch (args[0]) {
    case 'configtest':
    case 'help':
    case 'info':
    case 'init':
    case 'loader':
    case 'plugin':
    case 'version':
      return args
    case 'build':
    case 'serve':
    case 'watch':
      // https://webpack.js.org/api/cli/#flags
      // https://webpack.js.org/api/cli/#with-configuration-file
      return [args[0], '--config', configPath, ...args.slice(1)]
    default:
      return ['--config', configPath, ...args]
  }
}
