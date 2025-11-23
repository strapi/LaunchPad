const { exec, spawn } = require('child_process');
const { restrictFilepath } = require('./runtime.util');

const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    if (Array.isArray(args)) {
      args = args.join(' ');
    }
    const fullCommand = `${command} ${args}`;
    console.log('fullCommand', fullCommand, 'cwd', cwd);

    // Handle nohup command
    if (command.includes('nohup')) {
      // Use shell to execute nohup command
      const child = spawn('sh', ['-c', fullCommand], {
        cwd,
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'] // Ignore all standard input output
      });
      child.unref(); // Allow parent process to exit independently of child process
      resolve({
        stdout: `Background process started, PID: ${child.pid}, output redirected to nohup.out`,
        stderr: ''
      });
    } else {
      exec(fullCommand, { cwd }, (error, stdout, stderr) => {
        if (error) {
          reject({ error: error.message, stderr });
          return;
        }
        resolve({ stdout, stderr });
      });
    }
  });
}

const terminal_run = async (action, uuid) => {
  const { command, args = [], cwd = '.' } = action.params;
  const executionDir = await restrictFilepath(cwd);
  try {
    const result = await runCommand(command, args, executionDir);
    return {
      uuid,
      status: 'success',
      content: result.stdout || 'Execution result has no return content',
      stderr: result.stderr,
      meta: {
        action_type: action.type,
      }
    };
  } catch (e) {
    console.error('Error executing command:', e);
    return { status: 'failure', error: e.stderr || e.message, content: '' };
  }
}

module.exports = terminal_run;

