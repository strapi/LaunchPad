const CHANNEL = {
  OFFICIAL: 'official', // 官方部署-代理大模型服务
  PROVIDER: 'provider', // 模型服务商
  PRIVATE: 'private' // 私有化部署
}

const serviceHash = {
  'azure': require('./llm.azure.openai'),
  'gemini': require('./llm.gemini'),
}

const resolveServiceConfig = require('./resolveServiceConfig');
const resolvePlatformServiceConfig = async (model_info) => {
  const config = {
    channel: 'provider',
    service: model_info.platform_name,
    name: model_info.model_name,
    host: model_info.api_url,
    config: {
      API_KEY: model_info.api_key,
    }
  }
  return config
}

// 通用 LLM.config
const LLMStandard = require('./llm.config');
const resolveLLMStandard = (llm_config, model, onTokenStream) => {
  const configure = {
    url: llm_config.host,
    model: model,
    api_key: llm_config.config.API_KEY,
  }
  if (llm_config.config.appid) {
    configure.appid = llm_config.config.appid;
  }
  const llm = new LLMStandard(configure, onTokenStream);
  return llm;
}

const resolveKey = (model) => {
  if (model && model.startsWith('doubao')) {
    const envKey = 'ALIAS_' + model.replaceAll('-', '_').toUpperCase();
    console.log('envKey', envKey);
    return process.env[envKey] || model
  }
  return model
}

/**
 * 创建 LLM 调用实例
 * @param {*} config 
 * @param {*} onTokenStream 
 * @returns 
 */
const createLLMInstance = async (config, onTokenStream, options = {}) => {

  if (typeof config === 'string') {
    const [channel, service, model] = config.split('#')
    config = {
      channel,
      service,
      model: resolveKey(model)
    }
  }
  console.log('config', config);
  const { channel, service, model } = config;

  if (channel === CHANNEL.PROVIDER) {
    const LLM = serviceHash[service.toLowerCase()];
    console.log('options:', options);
    const llm_config = await resolvePlatformServiceConfig(options.model_info)
    if (!LLM) {
      return resolveLLMStandard(llm_config, model, onTokenStream);
    }
    // console.log("llm_config", llm_config);
    const llm = new LLM(onTokenStream, model, llm_config || {});
    return llm;
  }

  if (channel === CHANNEL.PRIVATE) {
    const llm_config = await resolveServiceConfig(CHANNEL.PRIVATE, service);
    const configure = {
      url: llm_config.host,
      model: model,
      api_key: llm_config.config.API_KEY
    }
    const llm = new LLMStandard(configure, onTokenStream);
    return llm;
  }
}

module.exports = exports = createLLMInstance