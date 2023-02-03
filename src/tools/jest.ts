import { defineTool } from './'

export default defineTool({
  name: 'jest',
  async run(ctx) {
    const mode = ctx.mode

    const args = []

    // https://jestjs.io/docs/configuration
    const config = await ctx.find(
      'config',
      mode
        ? [`jest.config.${mode}.+(js|ts|mjs|cjs|json)`]
        : ['jest.config.+(js|ts|mjs|cjs|json)'],
    )

    if (config) {
      // https://jestjs.io/docs/configuration
      args.push('--config', config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
