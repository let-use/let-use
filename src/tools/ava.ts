import { defineTool } from './'

export default defineTool({
  name: 'ava',
  async run(ctx) {
    const mode = ctx.mode

    // https://github.com/avajs/ava/blob/main/docs/06-configuration.md#using-avaconfig-files
    const config = await ctx.find(
      'config',
      mode
        ? [`ava.config.${mode}.+(js|cjs|mjs)`]
        : ['ava.config.+(js|cjs|mjs)'],
    )

    const args = tryAddConfigPath(ctx.args, config)

    await ctx.execute(args)
  },
})

function tryAddConfigPath(args: readonly string[], configPath?: string) {
  if (!configPath) {
    return args
  }
  // https://github.com/avajs/ava/blob/main/docs/05-command-line.md
  // https://github.com/avajs/ava/blob/main/docs/06-configuration.md#alternative-configuration-files
  switch (args[0]) {
    case 'debug':
    case 'reset-cache':
      return [args[0], '--config', configPath, ...args.slice(1)]
    default:
      return ['--config', configPath, ...args]
  }
}
