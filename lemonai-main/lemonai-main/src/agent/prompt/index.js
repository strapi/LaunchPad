const fs = require('fs').promises;
const path = require('path');
const PROMPT_DIR = path.resolve(__dirname);

/**
 * 加载指定目录下的 prompt 文件。
 * @param {string} directory_path - 要加载 prompt 的目录路径。
 * @param {string|null} [key=null] - 可选参数，如果提供，则只加载与 key 对应的 prompt 文件。
 * @returns {Promise<Object>} 一个包含 prompt 名称和内容的键值对对象，或者在指定 key 时只包含该 key 的对象。
 */
async function loadPrompt(directory_path = PROMPT_DIR, key = null) {
  const prompts = {};
  try {
    if (key) {
      // 如果指定了 key，只尝试加载该文件
      const filename = `${key}.md`;
      const filepath = path.join(directory_path, filename);
      try {
        const content = await fs.readFile(filepath, 'utf-8');
        console.log(`Loaded specific prompt: ${key} from ${filepath}`);
        return content;
      } catch (fileError) {
        if (fileError.code === 'ENOENT') {
          console.warn(`Prompt file not found for key: ${key} at ${filepath}`);
        } else {
          console.error(`Error reading prompt file for key ${key} at ${filepath}:`, fileError);
        }
        // 文件不存在或读取错误，返回空对象
      }
    } else {
      // 如果没有指定 key，加载目录下的所有 .md 文件
      const items = await fs.readdir(directory_path, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(directory_path, item.name);
        if (item.isDirectory()) {
          // 递归加载子目录 (不传递 key，因为我们在加载所有)
          const subPrompts = await loadPrompt(fullPath);
          Object.assign(prompts, subPrompts);
        } else if (item.isFile() && item.name.endsWith('.md')) {
          // 读取 Markdown 文件内容
          const content = await fs.readFile(fullPath, 'utf-8');
          const promptName = path.basename(item.name, '.md'); // 使用文件名（不含扩展名）作为键
          prompts[promptName] = content;
          console.log(`Loaded prompt: ${promptName} from ${fullPath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading prompts from ${directory_path}:`, error);
      // 如果目录不存在或无法读取，可以返回空对象或抛出错误
      // 这里选择记录错误并返回空对象
  }
  return prompts;
}

const resolveToolPrompt = require('./tool');

module.exports = {
  loadPrompt,
  resolveToolPrompt
};