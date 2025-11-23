const marked = require('marked');

const resolveMarkdown = async (markdown) => {

  const tokens = marked.lexer(markdown);
  const list = [];
  let title = '';
  let content = '';
  for (const token of tokens) {
    if (token.type === 'heading') {
      if (title) {
        list.push({ title, content });
        title = '';
        content = '';
      }
      title = token.text;
    } else {
      content += token.raw;
    }
  }
  if (title && content) {
    list.push({ title, content });
  }
  return list.map(item => {
    // @ts-ignore
    item.description = item.title + '\n' + item.content;
    return item;
  })
}

module.exports = exports = {
  resolveMarkdown
}