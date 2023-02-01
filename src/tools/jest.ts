import { defineTool } from './'

export default defineTool({
  name: 'jest',
  async run(ctx) {
    const args = []

    // https://jestjs.io/docs/configuration
    const config = await ctx.find('config', [
      'jest.config.+(js|ts|mjs|cjs|json)',
    ])

    if (config) {
      // https://jestjs.io/docs/configuration
      args.push('--config')
      args.push(config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
