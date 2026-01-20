const BaseLLM = require('./llm.base')

class ConfigLLM extends BaseLLM {

  constructor(config = {}, onTokenStream) {
    super(onTokenStream)
    const { url, model, splitter = '\n\n', api_key, appid } = config;
    this.splitter = splitter;
    this.CHAT_COMPLETION_URL = url;
    this.API_KEY = api_key;
    this.model = model;
    if (appid) {
      this.appid = appid;
    }
  }
}

module.exports = exports = ConfigLLM;