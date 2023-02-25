import { defineTool } from './'

export default defineTool({
  name: 'typedoc',
  async run(ctx) {
    const args = []

    // https://typedoc.org/guides/options/#configuration-options
    const config = await ctx.find('config', [
      'typedoc.(json|jsonc|js|cjs)',
      'typedoc.config.(js|cjs)',
    ])

    if (config) {
      // https://typedoc.org/guides/options/#options-1
      args.push('--options ', config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
