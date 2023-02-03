import { defineTool } from './'

export default defineTool({
  name: 'swc',
  async run(ctx) {
    const mode = ctx.mode

    const args = []

    // https://swc.rs/docs/configuration/swcrc
    const config = await ctx.find(
      'config',
      mode
        ? [`swc.${mode}.json`, `swc.config.${mode}.json`]
        : ['.swcrc', 'swc.json', 'swc.config.json'],
    )

    if (config) {
      // https://swc.rs/docs/usage/cli#--config-file
      args.push('--config-file')
      args.push(config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
