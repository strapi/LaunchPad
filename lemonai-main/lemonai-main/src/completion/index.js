const Azure = require('./llm.azure');
const OpenAI = require('./llm.openai');
const GLM3 = require('./llm.glm3');
const QWen = require('./llm.qwen');
const Qwen72bChat = require('./llm.qwen-72b-chat');
const Ollama = require('./llm.ollama');

const map = {
  'azure': Azure,
  'openai': OpenAI,
  'glm3': GLM3,
  'qwen': Qwen72bChat,
  'qwen.ali': QWen,
  'ollama': Ollama,
}

const createLLMInstance = (type, onTokenStream) => {
  // console.log('createLLMInstance.type', type)
  const LLM = map[type];
  // console.log('createLLMInstance.LLM', LLM);
  const llm = new LLM(onTokenStream);
  console.log(type, 'llm', llm);
  return llm;
}

module.exports = exports = createLLMInstance