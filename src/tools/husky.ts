import { defineTool } from './'

export default defineTool({
  name: 'husky',
  async run(ctx) {
    const dir = ctx.resolve('hooks', '.husky')

    let args = ctx.args
    // only rewrite `husky install` call
    if (args[0] === 'install') {
      // https://typicode.github.io/husky/#/?id=custom-directory
      args = ['install', dir]
    }
    await ctx.execute(args)
  },
})
