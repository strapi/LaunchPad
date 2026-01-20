const validateOptions = (options, rules) => {
  // console.log(Object.keys(rules));
  for (const key in rules) {
    const rule = rules[key];
    // 自定义校验规则
    if (typeof rule.message === 'function') {
      const message = rule.message(options, key)
      if (message) {
        return message
      }
    }
    // 必填校验
    if (rule.required && !options[key]) {
      return rule.message || `请告诉我 ${key} 的相关信息`;
    }
  }
}

module.exports = exports = {
  validateOptions
};