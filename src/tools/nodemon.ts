import { defineTool } from './'

export default defineTool({
  name: 'nodemon',
  async run(ctx) {
    const args = []

    // https://github.com/remy/nodemon#config-files
    const config = await ctx.find('config', ['nodemon.json'])

    if (config) {
      // https://github.com/remy/nodemon#config-files
      args.push('--config')
      args.push(config)
    }

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
