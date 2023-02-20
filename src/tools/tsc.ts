import { defineTool } from './'

export default defineTool({
  name: 'tsc',
  async run(ctx) {
    const mode = ctx.mode

    const args = []

    // https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#using-tsconfigjson-or-jsconfigjson
    const config = await ctx.find(
      'config',
      mode
        ? [`tsconfig.${mode}.json`, `jsconfig.${mode}.json`]
        : ['tsconfig.json', 'jsconfig.json'],
    )

    if (config) {
      // https://www.typescriptlang.org/docs/handbook/compiler-options.html
      args.push('--project', config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
