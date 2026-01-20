const LLMLogs = require("@src/models/LLMLogs");

const calcToken = require('./calc.token');

const calcTokenInput = (prompt, messages) => {
  let content = prompt;
  for (const message of messages) {
    content += message.content;
  }
  return calcToken(content);
}

const recordLLMLogs = async (model, userId, chainId, prompt, content, messages = []) => {
  const logValue = {
    model,
    userId,
    chainId,
    prompt,
    content,
    messages,
    tokenInput: calcTokenInput(prompt, messages),
    tokenOutput: calcToken(content),
    createTime: new Date(),
    updateTime: new Date()
  }
  // console.log('log.value', logValue);
  const r = await LLMLogs.create(logValue);
  return r;
}

module.exports = exports = recordLLMLogs;