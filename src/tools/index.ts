import ava from './ava'
import esbuild from './esbuild'
import eslint from './eslint'
import husky from './husky'
import jest from './jest'
import lintStaged from './lint-staged'
import parcel from './parcel'
import prettier from './prettier'
import releaseIt from './release-it'
import stylelint from './stylelint'
import swc from './swc'
import tsup from './tsup'
import vite from './vite'
import webpack from './webpack'

export interface ITool {
  name: string
  run: (ctx: IToolContext) => Promise<void> | void
}

export interface IToolContext {
  readonly mode?: string
  readonly args: readonly string[]
  readonly find: (
    tag: string,
    pattern: string | string[],
  ) => Promise<string | undefined>
  // relative path
  readonly resolve: (tag: string, ...path: string[]) => string
  readonly execute: (args: readonly string[]) => Promise<void>
  readonly log: {
    (msg: string): void
    (error: Error): void
    (tag: string, content: string): void
  }
}

const TOOLS = collectTools(
  ava,
  esbuild,
  eslint,
  husky,
  jest,
  lintStaged,
  parcel,
  prettier,
  releaseIt,
  stylelint,
  swc,
  tsup,
  vite,
  webpack,
)

function collectTools(...tools: ITool[]) {
  const o = Object.create(null) as Record<string, ITool>
  for (const tool of tools) {
    o[tool.name] = tool
  }
  return o
}

export function getTool(name: string): ITool | undefined {
  return TOOLS[name]
}

export function defineTool(t: ITool) {
  return t
}
