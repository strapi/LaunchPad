import http from "@/utils/http.js";

const service = {
  async uploadFile(form) {
    const uri = "/chain/api/resume/upload";
    const res = await http.post(uri, form, {
      "Content-Type": "multipart/form-data"
    });
    return res.data || {};
  }
}

export default service;