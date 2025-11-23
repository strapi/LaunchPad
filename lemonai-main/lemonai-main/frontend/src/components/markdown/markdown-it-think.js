
function markdownItThinking(md, options = {}) {
  // 定义一个 block 解析规则，匹配 <think> ... </think> 区块
  function thinkBlock(state, startLine, endLine, silent) {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const maxPos = state.eMarks[startLine];
    const lineText = state.src.slice(startPos, maxPos).trim();

    if (!lineText.startsWith('<think>')) return false;

    // 搜索结束标记 </think>
    let nextLine = startLine;
    let foundEnd = false;
    while (nextLine < endLine) {
      const pos = state.bMarks[nextLine] + state.tShift[nextLine];
      const max = state.eMarks[nextLine];
      const currLine = state.src.slice(pos, max);
      if (currLine.trim().endsWith('</think>')) {
        foundEnd = true;
        break;
      }
      nextLine++;
    }
    if (!foundEnd) return false; // 没有找到结束标记则跳过

    // 如果是 silent 模式，只检测是否匹配
    if (silent) return true;

    // 生成 open token（包含容器开始标签）
    let token = state.push('think_open', 'div', 1);
    token.block = true;
    token.map = [startLine, nextLine];
    token.attrs = [['class', 'thinking-container']];

    // 生成内容 token，内容为 <think> 和 </think> 之间的内容
    const contentLines = [];
    // 如果开始行除了 <think> 后还有内容，也算作第一行内容
    const firstLine = state.src.slice(startPos, maxPos);
    const startTagIndex = firstLine.indexOf('<think>');
    let firstContent = firstLine.slice(startTagIndex + '<think>'.length);
    if (firstContent.trim()) {
      contentLines.push(firstContent);
    }
    for (let i = startLine + 1; i < nextLine; i++) {
      const pos = state.bMarks[i] + state.tShift[i];
      const max = state.eMarks[i];
      contentLines.push(state.src.slice(pos, max));
    }
    // 最后一行去掉 </think>
    const lastLine = contentLines.pop() || '';
    const endTagIndex = lastLine.lastIndexOf('</think>');
    const lastContent = endTagIndex >= 0 ? lastLine.slice(0, endTagIndex) : lastLine;
    contentLines.push(lastContent);

    // 生成 close token（用于渲染按钮和容器结束标签）
    token = state.push('think_close', 'div', 0);
    token.block = true;
    token.map = [startLine, nextLine];

    token = state.push('thinking_content', 'div', -1);
    token.block = true;
    token.content = contentLines.join('\n').trim();
    token.map = [startLine, nextLine];

    state.line = nextLine + 1;
    return true;
  }

  // 注册 block 规则，优先于 fence
  md.block.ruler.before('fence', 'think', thinkBlock, { alt: [] });

  // 渲染规则：open token
  md.renderer.rules.think_open = function (tokens, idx, options, env, self) {
    return `<div class="thinking-container">`;
  };

  // 渲染规则：内容 token，初始隐藏，使用 md.render 处理内容（你也可以不做二次解析）
  md.renderer.rules.thinking_content = function (tokens, idx, options, env, self) {
    // 此处直接输出 token.content，如有需要可使用 md.renderInline(tokens[idx].content)
    return `<div class="thinking-content" style="display:block;">${md.render(tokens[idx].content)}</div>`;
  };

  // 渲染规则：close token，在容器末尾添加展开/收起按钮，并关闭容器
  md.renderer.rules.think_close = function (tokens, idx, options, env, self) {
    return `<div class="thinking-toggle" onclick="(function(el){ 
      var content = el.nextElementSibling;
      if(content.style.display==='none'){
        content.style.display='block'; 
        el.innerText='已深度思考 △';
      } else {
        content.style.display='none'; 
        el.innerText='已深度思考 ▽';
      }
    })(this)">已深度思考 △</div>`;
  };
}

export default markdownItThinking;