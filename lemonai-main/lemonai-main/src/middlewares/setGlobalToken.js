// middleware/setGlobalToken.js
const globals = require('../globals'); // 确保这里的路径是正确的，指向你的globals.js文件

module.exports = async (ctx, next) => {
  const authHeader = ctx.request.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    globals.setToken(token); // 不推荐：这将覆盖前一个请求的token
  } else {
    // 如果没有token，可以选择清空全局token或不做任何操作
    // globals.setToken(null);
  }

  await next(); // 继续处理后续的中间件或路由
};