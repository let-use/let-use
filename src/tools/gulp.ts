import { defineTool } from './'

export default defineTool({
  name: 'gulp',
  async run(ctx) {
    const args = []

    // https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles#gulpfile-explained
    // https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles/#splitting-a-gulpfile
    const config = await ctx.find('config', [
      'gulpfile.(js|ts)',
      'gulpfile.(babel|esm).js',
    ])

    if (config) {
      // https://github.com/gulpjs/gulp-cli#flags
      args.push('--gulpfile', config)
    }

    // Do not pass the `--cwd` option to avoid path confusion.

    args.push(...ctx.args)

    await ctx.execute(args)
  },
})
