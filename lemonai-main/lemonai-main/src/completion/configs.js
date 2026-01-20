const env = process.env || {}

const configs = [
  {
    channel: 'provider',
    service: 'spark',
    name: '讯飞星火',
    config: {
      "appid": env.SPARK_APPID,
      "key": env.SPARK_KEY,
      "secret": env.SPARK_SECRET
    },
    models: ['V1.5']
  },
  {
    channel: 'provider',
    service: 'wenxin',
    name: '百度文心',
    config: {
      client_id: env.WENXIN_CLIENT_ID,
      client_secret: env.WENXIN_CLIENT_SECRET
    },
    models: ['ernie_speed']
  },
  {
    channel: 'provider',
    service: 'tencent',
    name: '腾讯混元',
    config: {
      secret_id: env.TENCENT_SECRET_ID,
      secret_key: env.TENCENT_SECRET_KEY
    },
    models: ['hunyuan-lite']
  },
  {
    channel: 'provider',
    service: 'zhipu',
    name: "智谱清言",
    host: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    config: {
      API_KEY: env.ZHIPU_KEY,
    }
  },
  {
    channel: 'provider',
    service: 'llmfarm',
    name: 'Qwen-72B-Chat-Int4',
    host: 'http://qwen.frp2.friai.com/v1/chat/completions',
    // models: 'http://qwen.frp2.friai.com/v1/models',
    config: {},
    models: ['Qwen-72B-Chat-Int4']
  }, {
    channel: 'provider',
    service: 'deepseek',
    name: 'deepseek-chat',
    host: `https://api.deepseek.com/v1/chat/completions`,
    config: {
      API_KEY: env.DEEPSEEK_API_KEY
    }
  }, {
    channel: 'provider',
    service: 'moonshot',
    name: '月之暗面',
    host: `https://api.moonshot.cn/v1/chat/completions`,
    config: {
      API_KEY: env.MOONSHOT_API_KEY
    }
  }, {
    channel: 'provider',
    service: 'minimax',
    name: 'abab6.5s-chat',
    host: `https://api.minimax.chat/v1/text/chatcompletion_v2`,
    config: {
      API_KEY: env.MINIMAX_API_KEY
    }
  }, {
    channel: 'provider',
    service: 'doubao',
    name: '豆包大模型',
    host: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`,
    config: {
      API_KEY: env.DOUBAO_API_KEY
    },
    models: ['doubao-pro-32k']
  }, {
    channel: 'provider',
    service: 'lingji',
    name: '灵积',
    host: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`,
    config: {
      API_KEY: env.DASHSCOPE_API_KEY
    },
    models: ['qwen-plus']
  }, {
    channel: 'provider',
    service: 'azure',
    name: '微软云',
    config: {
      API_KEY: env.OPENAI_AZURE_KEY,
    },
    models: ['gpt-4o-mini']
  }, {
    channel: 'provider',
    service: 'siliconflow',
    name: '硅基流动',
    host: 'https://api.siliconflow.cn/v1/chat/completions',
    config: {
      API_KEY: env.SILICON_API_KEY
    },
    models: ['Qwen/Qwen2.5-7B-Instruct']
  }, {
    channel: 'provider',
    service: 'openrouter',
    name: 'openrouter',
    host: 'https://openrouter.ai/api/v1/chat/completions',
    config: {
      API_KEY: env.OPENROUTER_API_KEY
    },
    models: ['google/gemini-2.0-flash-thinking-exp:free']
  }, {
    channel: 'provider',
    service: 'xunfei',
    name: '讯飞星火',
    host: 'https://spark-api-open.xf-yun.com/v2/chat/completions',
    config: {
      API_KEY: 'mrYCJdsdXJPelFcLgMnG:ZamRroaSVJsYgjzDsrSd'
    },
    models: ['x1']
  }
]

const fs = require('fs')
const llmJsonPath = env.LLM_JSON_PATH
if (llmJsonPath) {
  const llmJson = fs.readFileSync(llmJsonPath, 'utf-8')
  const list = JSON.parse(llmJson)
  for (const item of list) {
    configs.push(item)
  }
}

module.exports = exports = configs;