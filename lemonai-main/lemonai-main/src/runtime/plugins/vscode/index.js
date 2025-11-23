import util from 'util';
import { exec as execCb, spawn } from 'child_process'; // 引入 spawn

const exec = util.promisify(execCb); // exec 仍然用于短命令

export async function run(username, vscodePort) {
  try {
    console.log(`[VSCODE_INIT] Changing ownership of /chataa/.openvscode-server to ${username}:${username}...`);
    // 1. 更改 openvscode-server 目录的所有权 (这是一个短命令，exec 是合适的)
    const { stdout: chownStdout, stderr: chownStderr } = await exec(
      `sudo chown -R ${username}:${username} /chataa/.openvscode-server`,
      { shell: '/bin/bash' }
    );
    if (chownStdout) console.log('[VSCODE_INIT] Chown stdout:', chownStdout);
    if (chownStderr) console.error('[VSCODE_INIT] Chown stderr:', chownStderr);
    console.log('[VSCODE_INIT] Ownership changed successfully.');

    console.log(`[VSCODE_INIT] Starting openvscode-server on port ${vscodePort} in detached mode...`);
    // 2. 启动 openvscode-server (这是一个长期运行的服务器进程，必须使用 spawn 并 detached)

    // 构建传递给 openvscode-server 的参数列表
    const args = [
      '-u', username, // sudo 的 -u 参数
      '/chataa/.openvscode-server/bin/openvscode-server', // openvscode-server 可执行文件路径
      '--host', '0.0.0.0',
      '--port', String(vscodePort), // 端口号确保是字符串
      '--disable-workspace-trust',
      '--without-connection-token'
    ];

    // 使用 spawn 来启动 sudo 命令，sudo 再执行 openvscode-server
    const vscodeServerProcess = spawn(
      'sudo', // 命令本身是 sudo
      args,  // 剩下的都是 sudo 的参数和 openvscode-server 的参数
      {
        cwd: '/workspace', // 工作目录
        shell: '/bin/bash', // 使用 shell
        detached: true,     // 关键：让子进程在父进程退出后继续运行
        stdio: 'inherit'    // 关键：将子进程的 stdout/stderr 连接到父进程的 stdout/stderr
      }
    );

    // 解除父进程对子进程的引用计数。
    // 这允许 Node.js 事件循环在子进程仍然运行时退出。
    vscodeServerProcess.unref();

    // 监听子进程的错误事件，例如如果 sudo 命令找不到
    vscodeServerProcess.on('error', (err) => {
      console.error('[VSCODE_INIT] Failed to start VS Code server process:', err);
      // 在这里可以决定是否需要抛出错误或执行其他恢复操作
    });

    console.log(`[VSCODE_INIT] VS Code server process started with PID: ${vscodeServerProcess.pid}`);
    console.log('[VSCODE_INIT] Note: The VS Code server process is running in the background and its output is forwarded to this console.');

    // 因为服务器是后台运行的，run 函数会立即返回。
    return { success: true, pid: vscodeServerProcess.pid, message: 'VS Code server started in detached mode' };

  } catch (error) {
    console.error('[VSCODE_INIT] Execution failed:', error.message);
    if (error.stdout) {
      console.error('[VSCODE_INIT] Command stdout (if available):', error.stdout);
    }
    if (error.stderr) {
      console.error('[VSCODE_INIT] Command stderr (if available):', error.stderr);
    }
    throw error; // 重新抛出错误，以便主程序捕获
  }
}