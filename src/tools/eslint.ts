import { defineTool } from './'

export default defineTool({
  name: 'eslint',
  async run(ctx) {
    const args = []

    // https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats
    const config = await ctx.find('config', [
      '.eslintrc',
      '.eslintrc.+(js|cjs|yaml|yml|json)',
    ])

    if (config) {
      // https://eslint.org/docs/latest/use/configure/configuration-files#using-configuration-files
      args.push('--config')
      args.push(config)
    }

    // https://eslint.org/docs/latest/use/configure/ignore#the-eslintignore-file
    const ignore = await ctx.find('ignore', ['.eslintignore'])

    if (ignore) {
      // https://eslint.org/docs/latest/use/configure/ignore#using-an-alternate-file
      args.push('--ignore-path')
      args.push(ignore)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
