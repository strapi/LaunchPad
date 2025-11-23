/**
 * Logger 类 - 使用 Pino 实现的日志记录器
 * 提供基本的日志级别方法（log、info、error 等）
 */

const pino = require('pino');

class Logger {
  /**
   * 创建一个新的日志记录器实例
   * @param {string} name - 日志记录器名称，用于标识日志来源
   * @param {object} options - Pino 日志配置选项
   */
  constructor(name, options = {}) {
    // 默认配置
    const defaultOptions = {
      name,
      level: process.env.LOG_LEVEL || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
    };

    // 合并用户提供的选项与默认选项
    const loggerOptions = { ...defaultOptions, ...options };

    // 创建 Pino 日志实例
    this.logger = pino(loggerOptions);
  }

  /**
   * 记录普通日志信息 (info 级别)
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  log(message, data = {}) {
    this.info(message, data);
  }

  /**
   * 记录调试信息
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  debug(message, data = {}) {
    this.logger.debug(data, message);
  }

  /**
   * 记录信息级别日志
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  info(message, data = {}) {
    this.logger.info(data, message);
  }

  /**
   * 记录警告信息
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  warn(message, data = {}) {
    this.logger.warn(data, message);
  }

  /**
   * 记录错误信息
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  error(message, data = {}) {
    this.logger.error(data, message);
  }

  /**
   * 记录致命错误信息
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据对象
   */
  fatal(message, data = {}) {
    this.logger.fatal(data, message);
  }

  /**
   * 创建子日志记录器
   * @param {object} bindings - 绑定到子日志记录器的数据
   * @returns {Logger} 新的日志记录器实例
   */
  child(bindings) {
    const childLogger = this.logger.child(bindings);
    const newLogger = new Logger();
    newLogger.logger = childLogger;
    return newLogger;
  }
}

module.exports = Logger;