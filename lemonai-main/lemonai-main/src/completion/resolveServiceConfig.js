const configs = require('./configs.js')

const resolveServiceConfig = async (channel, service = '') => {
  const config = configs.find(item => {
    return item.channel === channel && item.service === service
  });
  return config || {}
}

module.exports = exports = resolveServiceConfig