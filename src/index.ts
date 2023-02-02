import { runTool } from './runner'

const [, , cmd, ...args] = process.argv

runTool(cmd, args)
