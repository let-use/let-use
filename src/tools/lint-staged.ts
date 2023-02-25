import { defineTool } from './'

export default defineTool({
  name: 'lint-staged',
  async run(ctx) {
    const args = []

    // https://github.com/okonet/lint-staged#configuration
    const config = await ctx.find('config', [
      '.lintstagedrc',
      '.lintstagedrc.(js|mjs|cjs|json|yaml|yml)',
      'lintstaged.config.(js|mjs|cjs)',
    ])

    if (config) {
      // https://github.com/okonet/lint-staged#configuration
      args.push('--config', config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
