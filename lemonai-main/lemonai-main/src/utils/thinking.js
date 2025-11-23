// resolve thinking content and output content
const resolveThinking = (content) => {
  content = content.trim();
  let thinking = '';
  let output = '';
  if (content.startsWith('<think>') && content.indexOf('</think>') !== -1) {
    const end = content.indexOf('</think>');
    thinking = content.slice(0, end + 8).trim();
    output = content.slice(end + 8).trim();
  }
  return { thinking, content: output };
}

module.exports = resolveThinking;