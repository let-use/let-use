import { defineTool } from '../'

export default defineTool({
  name: 'fallback',
  async run(ctx) {
    await ctx.execute(ctx.args)
  },
})
