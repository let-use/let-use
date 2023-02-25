import { defineTool } from './'

export default defineTool({
  name: 'prettier',
  async run(ctx) {
    const args = []

    // https://prettier.io/docs/en/configuration.html
    const config = await ctx.find('config', [
      '.prettierrc',
      '.prettierrc.(json|yml|yaml|json5|js|cjs|toml)',
      'prettier.config.(js|cjs)',
    ])

    if (config) {
      // https://prettier.io/docs/en/cli.html#--find-config-path-and---config
      args.push('--config', config)
    }

    // https://prettier.io/docs/en/ignore.html
    const ignore = await ctx.find('ignore', ['.prettierignore'])

    if (ignore) {
      // https://prettier.io/docs/en/cli.html#--find-config-path-and---config
      args.push('--ignore-path', ignore)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
