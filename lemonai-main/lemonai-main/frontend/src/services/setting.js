import http from '@/utils/http.js'

const service = {
  async get() {
    const uri = '/api/settings'
    const res = await http.get(uri)
    return {
      modelName: res.data?.llm_model || 'GPT-4',
      modelUrl: res.data?.llm_base_url || '',
      apiKey: res.data?.llm_api_key || ''
    }
  },

  async save(settings) {
    const uri = '/api/settings'
    await http.post(uri, {
      llm_model: settings.modelName,
      llm_base_url: settings.modelUrl,
      llm_api_key: settings.apiKey
    })
  }
}

export default service