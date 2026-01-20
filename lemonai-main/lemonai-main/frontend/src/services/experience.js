import http from '@/utils/http.js'

const service = {
    async getExperienceByType(type) {
        const uri = `/api/experience/list`
        const params = {
            type: type
        }
        const response = await http.get(uri, params)
        return response || {};
    },
    async createExperience(params) {
        const uri = `/api/experience`
        const response = await http.post(uri, params)
        return response || {};
    },
    async updateExperience(params) {
        const uri = `/api/experience`
        const response = await http.put(uri, params)
        return response || {};
    },
    async deleteExperience(id) {
        const uri = `/api/experience`
        const params = {
            id: id
        }
        const response = await http.del(uri,params)
        return response || {};
    }
}

export default service