import { marked } from 'marked'; // 引入 marked

export const renderMarkdown = (content) => {
  // 创建自定义 renderer
  const renderer = new marked.Renderer();

  // 重写 renderer 的 link 方法，添加 target="_blank" 和 rel="noopener noreferrer"
  renderer.link = function (href, title, text) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
  };

  // 使用自定义 renderer
  const html = marked(content, {
    renderer: renderer,
    breaks: true,
  });

  return html;
};

export default {
  renderMarkdown
};