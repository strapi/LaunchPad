import http from '@/utils/http.js'

const service = {
  async getVersionInfo() {
    const uri = `/api/version/`
    const response = await http.get(uri)
    return response || {};
  }
}

export default service