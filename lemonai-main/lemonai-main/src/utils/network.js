const axios = require('axios');

const proxy = {
  protocol: process.env.PROXY_PROTOCOL || 'http',
  host: process.env.PROXY_HOST,
  port: process.env.PROXY_PROT
}

const resolveAxiosInstance = () => {
  if (process.env.PROXY_HOST) {
    const instance = axios.create({
      proxy: proxy
    });
    return instance;
  }
  return axios.create({});
}

module.exports = exports = {
  resolveAxiosInstance
}