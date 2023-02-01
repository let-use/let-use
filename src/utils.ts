import { spawn, SpawnOptions } from 'node:child_process'

export async function spawnAsync(
  command: string,
  args: readonly string[],
  options?: SpawnOptions,
) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  })
  return (
    (await new Promise<number | undefined>((resolve) => {
      child.on('close', resolve)
    })) ?? 0
  )
}
