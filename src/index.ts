import { runTool } from './runner'

const [, , name, ...args] = process.argv

runTool(name, args)
