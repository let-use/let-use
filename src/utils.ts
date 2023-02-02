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

export function isCI() {
  const env = process.env
  // Copy from ci-info
  // https://github.com/watson/ci-info/blob/f8d37a35/index.js#L56
  return !!(
    env.CI !== 'false' && // Bypass all checks if CI env is explicitly set to 'false'
    (env.BUILD_ID || // Jenkins, Cloudbees
      env.BUILD_NUMBER || // Jenkins, TeamCity
      env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
      env.CI_APP_ID || // Appflow
      env.CI_BUILD_ID || // Appflow
      env.CI_BUILD_NUMBER || // Appflow
      env.CI_NAME || // Codeship and others
      env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
      env.RUN_ID || // TaskCluster, dsari
      false)
  )
}
