import util from 'util';
import { exec as execCb, spawn } from 'child_process'; // 引入 spawn

const exec = util.promisify(execCb);

export async function run(username, browserPort) {
  try {
    // 1. 更改 openvscode-server 目录的所有权
    // 这一步仍然使用 exec 是合适的，因为它是一个短期命令，并且必须在启动服务器前完成。
    console.log(`Changing ownership of /chataa/code/browser_server to ${username}:${username}...`);
    const { stdout: chownStdout, stderr: chownStderr } = await exec(
      `sudo chown -R ${username}:${username} /chataa/code/browser_server`,
      { shell: '/bin/bash' }
    );
    if (chownStdout) console.log('Chown stdout:', chownStdout);
    if (chownStderr) console.error('Chown stderr:', chownStderr);
    console.log('Ownership changed successfully.');

    // 2. 启动 openvscode-server (server.py)
    console.log('Starting browser server (server.py) in detached mode...');

    // 构建传递给 Python 脚本的参数列表
    // 假设你的 server.py 需要一个端口参数，你可以这样传递：
    // const args = ['/chataa/code/browser_server/browser_use/server.py', '--port', browserPort];
    // 如果不需要，就只有脚本路径：
    const args = ['/chataa/code/browser_server/browser_use/server.py'];

    const serverProcess = spawn(
      '/chataa/micromamba/envs/chataa/bin/python', // Python 解释器路径
      args,                                      // 脚本路径和参数
      {
        cwd: '/chataa/code/browser_server', // 工作目录
        shell: '/bin/bash',                        // 使用 bash shell
        detached: true,                            // 关键：让子进程在父进程退出后继续运行
        stdio: 'inherit',                          // 关键：将子进程的 stdout/stderr 连接到父进程的 stdout/stderr
        // 这样你就能在 Node.js 进程的控制台上看到 server.py 的输出
        // 替代方案：
        // 'ignore' - 完全不显示输出
        // ['ignore', fs.openSync('server.log', 'a'), 'pipe'] - 重定向 stdout 到文件，stderr 管道化
      }
    );

    // 解除父进程对子进程的引用计数。
    // 这允许 Node.js 事件循环在子进程仍然运行时退出。
    serverProcess.unref();

    // 监听子进程的错误事件，例如如果 python 命令找不到
    serverProcess.on('error', (err) => {
      console.error('Failed to start server process:', err);
      // 在这里可以决定是否需要抛出错误或执行其他恢复操作
    });

    // 你也可以监听其他事件，例如 'close'，但这对于一个预期长期运行的服务器可能不是立即需要的
    // serverProcess.on('close', (code) => {
    //   console.log(`Server process exited with code ${code}`);
    // });


    console.log(`Browser server process started with PID: ${serverProcess.pid}`);
    console.log('Note: The server process is running in the background and its output is forwarded to this console.');

    // 因为服务器是后台运行的，run 函数会立即返回。
    // 返回的信息不再是服务器的完整 stdout/stderr，而是启动成功和进程ID。
    return { success: true, pid: serverProcess.pid, message: 'Server started in detached mode' };

  } catch (error) {
    console.error('Execution failed:', error.message);
    if (error.stdout) {
      console.error('Command stdout (if available):', error.stdout);
    }
    if (error.stderr) {
      console.error('Command stderr (if available):', error.stderr);
    }
    throw error;
  }
}
