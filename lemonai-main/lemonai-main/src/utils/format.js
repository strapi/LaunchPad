/**
 * 将 JSON 对象转换为 XML 字符串
 * @param {Object} obj - 要转换的 JSON 对象
 * @returns {string} - 转换后的 XML 字符串
 */
const json2xml = (obj) => {
  // 处理基本数据类型
  if (typeof obj !== 'object') {
    return String(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => json2xml(item)).join('\n');
  }

  // 处理对象
  return Object.entries(obj).map(([key, value]) => {
    // 处理 null 和 undefined
    if (value === null || value === undefined) {
      return `<${key}/>\n`;
    }

    // 处理普通节点
    const content = json2xml(value);
    // 如果内容中已经包含换行符，需要对内容进行缩进处理
    const formattedContent = content.includes('\n')
      ? content.split('\n').map(line => line ? `  ${line}` : line).join('\n')
      : content;
    return `<${key}>\n${formattedContent}\n</${key}>`;
  }).join('\n');
}

module.exports = exports = {
  json2xml
}
