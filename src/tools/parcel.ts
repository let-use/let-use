import { defineTool } from './'

export default defineTool({
  name: 'parcel',
  async run(ctx) {
    const mode = ctx.mode

    // https://parceljs.org/plugin-system/configuration/
    const config = await ctx.find(
      'config',
      mode
        ? [`parcel.config.${mode}.json`]
        : ['.parcelrc', `parcel.config.json`],
    )

    const args = tryAddConfigPath(ctx.args, config)

    await ctx.execute(args)
  },
})

function tryAddConfigPath(args: readonly string[], configPath?: string) {
  if (!configPath) return args
  // https://parceljs.org/features/cli/#parameters
  switch (args[0]) {
    case 'build':
    case 'watch':
    case 'serve':
      return [args[0], '--config', configPath, ...args.slice(1)]
    default:
      return ['--config', configPath, ...args]
  }
}
