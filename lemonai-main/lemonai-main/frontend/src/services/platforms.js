import http from '@/utils/http.js'
import { getDefaults } from 'marked';

const service = {
  // 获取用户平台信息
  async getPlatforms() {
    const uri = `/api/platform`
    const response = await http.get(uri)
    return response || {};
  },

  // 新增平台信息
  async insertPlatform(platformData) {
    const uri = `/api/platform`
    const response = await http.post(uri, platformData)
    return response || {};
  },

  // 更新平台信息
  async updatePlatform(platformData) {
    const uri = `/api/platform/${platformData.id}`
    const response = await http.put(uri, platformData)
    return response.data || {};
  },

  // 删除平台信息
  async deletePlatform(platform_id) {
    const uri = `/api/platform/${platform_id}`
    const response = await http.del(uri)
    return response.data || {}
  },

  // 获取模型列表
  async getModels(platformId) {
    const uri = `/api/model/list/${platformId}`
    const response = await http.get(uri)
    return response || []
  },

  // 删除模型
  async deleteModel(modelId) {
    const uri = `/api/model/${modelId}`
    const response = await http.del(uri, { id: modelId })
    return response.data || {}
  },

  // 新增模型
  async insertModel(modelData) {
    const uri = `/api/model`
    const response = await http.post(uri, modelData)
    return response || {}
  },

  // 更新模型
  async updateModel(modelData) {
    // console.log(modelData)
    const uri = `/api/model/${modelData.id}`
    const response = await http.put(uri, modelData)
    return response.data || {}
  },
  //<span>/api<wbr>/platform<wbr>/check_api_availability</span>
  async checkApiAvailability(params) {
    const uri = `/api/platform/check_api_availability`
    const response = await http.post(uri, params)
    return response || {}
  },

}

export default service