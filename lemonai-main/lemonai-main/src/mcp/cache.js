const CacheService = {
  _cache: new Map(),
  has(key) {
    const entry = this._cache.get(key);
    if (!entry) return false;
    if (entry.expiry && Date.now() > entry.expiry) {
      this._cache.delete(key);
      return false;
    }
    return true;
  },
  get(key) {
    if (this.has(key)) {
      return this._cache.get(key).value;
    }
    return undefined;
  },
  set(key, value, ttl) {
    const expiry = ttl ? Date.now() + ttl : null;
    this._cache.set(key, { value, expiry });
  },
  remove(key) {
    this._cache.delete(key);
  },
};



/**
 * 高阶函数，为任何异步函数添加缓存能力
 * @param {Function} fn 要被包装的原始异步函数
 * @param {Function} getCacheKey 从函数参数生成缓存键的函数
 * @param {number} ttl 缓存条目的存活时间（毫秒）
 * @param {string} logPrefix 日志消息的前缀
 * @returns {Function} 包装后的具有缓存能力的函数
 */
function withCache(fn, getCacheKey, ttl, logPrefix) {
  return async (...args) => {
    const cacheKey = getCacheKey(...args);

    if (CacheService.has(cacheKey)) {
      console.log(`${logPrefix} loaded from cache`);
      const cachedData = CacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const result = await fn(...args);
    CacheService.set(cacheKey, result, ttl);
    return result;
  };
}

module.exports = {
  CacheService,
  withCache,
}