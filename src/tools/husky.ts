import { defineTool } from './'
import { isCI } from '../utils'
import chalk from 'chalk'

export default defineTool({
  name: 'husky',
  async run(ctx) {
    const dir = ctx.resolve('hooks', '.husky')

    let args = ctx.args
    // only rewrite `husky install` call
    if (args[0] === 'install') {
      const ci = isCI()
      ctx.log('ci', ci ? 'true' : chalk.gray('false'))
      if (ci) {
        ctx.log('husky install skipped')
        return
      }
      // https://typicode.github.io/husky/#/?id=custom-directory
      args = ['install', dir]
    }
    await ctx.execute(args)
  },
})
