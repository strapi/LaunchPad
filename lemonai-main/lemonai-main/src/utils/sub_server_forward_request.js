require('dotenv').config()
const axios = require('axios')
const SUB_SERVER_DOMAIN = process.env.SUB_SERVER_DOMAIN || 'https://app.lemonai.ai';
async function forwardRequest(ctx, method, path) {
  const url = `${SUB_SERVER_DOMAIN}${path}`;
  const config = {
    method,
    maxBodyLength: Infinity,
    url,
    headers: {
      authorization: ctx.headers['authorization'],
    },
  };

  if (method.toUpperCase() === 'GET') {
    config.params = ctx.query; // GET 请求通过 query 传参
  } else {
    config.data = ctx.request.body; // POST、PUT 等通过 body 传参
  }

  const result = await axios.request(config);
  return result.data;
}

module.exports = exports = forwardRequest;