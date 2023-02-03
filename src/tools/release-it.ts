import { defineTool } from './'

export default defineTool({
  name: 'release-it',
  async run(ctx) {
    const args = []

    // https://github.com/release-it/release-it/blob/master/docs/configuration.md#configuration
    const config = await ctx.find('config', [
      '.release-it.+(js|cjs|json|yaml|yml|toml)',
    ])

    if (config) {
      // https://github.com/release-it/release-it/blob/master/docs/configuration.md#configuration
      args.push('--config')
      args.push(config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
