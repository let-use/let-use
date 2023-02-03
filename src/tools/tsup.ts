import { defineTool } from './'

export default defineTool({
  name: 'tsup',
  async run(ctx) {
    const mode = ctx.mode

    const args = []

    // https://tsup.egoist.dev/#using-custom-configuration
    const config = await ctx.find(
      'config',
      mode
        ? [`tsup.config.${mode}.+(js|ts|cjs|json)`]
        : ['tsup.config.+(js|ts|cjs|json)'],
    )

    if (config) {
      // https://tsup.egoist.dev/#using-custom-configuration
      args.push('--config')
      args.push(config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
