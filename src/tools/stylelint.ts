import { defineTool } from './'

export default defineTool({
  name: 'stylelint',
  async run(ctx) {
    const args = []

    // https://github.com/stylelint/stylelint/blob/main/docs/user-guide/configure.md#configuration
    const config = await ctx.find('config', [
      '.stylelintrc',
      '.stylelintrc.+(js|json|yaml|yml)',
      'stylelint.config.+(js|cjs)',
    ])

    if (config) {
      // https://github.com/stylelint/stylelint/blob/main/docs/user-guide/usage/cli.md#--config
      args.push('--config', config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
