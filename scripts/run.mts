import { spawn } from 'child_process';

/** Runs a command, inheriting stdio, rejecting on a non-zero exit. */
export function run(
  command: string,
  args: string[],
  options: { cwd?: string } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}
