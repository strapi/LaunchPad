const which = require('which');
const { resolve } = require('path');
const { homedir } = require('os');

/**
 * 动态获取二进制文件的路径，优先从系统 PATH 查找，
 * 如果找不到，则尝试在常见的用户自定义路径下查找。
 *
 * @param {string} command 需要查找的命令 (例如 'bun' 或 'uvx').
 * @returns {Promise<string>} 解析出的二进制文件路径.
 */
const getBinaryPath = async (command) => {
  try {
    // 首先尝试在系统的 PATH 环境变量中查找
    const resolvedPath = await which(command);
    console.log(`[MCP] Found binary for '${command}' in system PATH: ${resolvedPath}`);
    return resolvedPath;
  } catch (error) {
    // 如果在 PATH 中找不到，可以根据需要尝试在一些默认位置查找
    console.log(`[MCP] '${command}' not found in system PATH. Attempting to find in common user directories.`);
    const userPaths = {
      bun: resolve(homedir(), '.bun', 'bin', 'bun'),
      uvx: resolve(homedir(), '.local', 'bin', 'uvx'),
    };

    if (userPaths[command]) {
      try {
        const resolvedPath = await which(userPaths[command]);
        console.log(`[MCP] Found binary for '${command}' at fallback path: ${resolvedPath}`);
        return resolvedPath;
      } catch (fallbackError) {
        console.error(`[MCP] Failed to find '${command}' in both system PATH and fallback location (${userPaths[command]}).`);
      }
    }
  }

  // 如果所有方法都失败了，作为最后的备选方案，直接返回命令本身
  // 这依赖于执行 shell 的环境能够自行解析
  console.log(`[MCP] Assuming binary for '${command}' is in the system PATH and executable directly.`);
  return command;
}

module.exports = getBinaryPath

// 使用示例:
async function startMcp() {
  try {
    const bunPath = await getBinaryPath('bun');
    const uvxPath = await getBinaryPath('uvx');
    console.log('bun path:', bunPath);
    console.log('uvx path:', uvxPath);
  } catch (e) {
    console.error('Error starting MCP:', e);
  }
}

// startMcp();