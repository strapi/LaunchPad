const {getContentTypeByFileName} = require('@src/utils/file_type_response');

const responseWrap = (response) => {
    response.success = function (data, msg = "成功", status = 200) {
      const res = {
        data,
        code: 0,
        msg,
      };
      this.body = res;
      this.status = status;
    };
  
    response.fail = function (data, msg = "接口错误", status = 200) {
      const res = {
        data,
        code: 1,
        msg,
      };
      this.body = res;
      this.status = status;
    };
  
    response.file = function (fileName, stream) {
      // process Content-Type by file type
      const contentType = getContentTypeByFileName(fileName)
      response.set('Content-Type', contentType)
      response.set(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent(fileName)}`
      )
      this.body = stream
    };
  };
  
  module.exports = exports = async (ctx, next) => {
    responseWrap(ctx.response);
    await next();
  };
  