const axios = require('axios');
// const { resolveAxiosInstance } = require('@utils/network');
const HOST = 'https://api.tavily.com/search';

class TalivySearch {
  constructor({ key: API_KEY }) {
    this.API_KEY = API_KEY;
    this.baseUrl = HOST;
  }

  async search(query, options = {}) {
    const defaultOptions = {
      topic: 'general',
      search_depth: 'basic',
      max_results: 1,
      include_raw_content: true,
      include_images: false,
      include_image_descriptions: false,
      include_domains: [],
      exclude_domains: []
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      query
    };

    try {
      // @ts-ignore
      const response = await axios.post(this.baseUrl, requestOptions, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      this.result = response.data
      return this.result;
    } catch (error) {
      console.error('TalivySearch error:', error);
      throw error;
    }
  }

  async formatContent() {
    const { query, num_results, results = [] } = this.result;
    const list = []
    for (const item of results) {
      const description = `URL: ${item.url}\nTitle: ${item.title}\nContent: ${item.content}\n`;
      list.push(description);
    }
    return list.join('======\n======');
  }

  async formatJSON() {
    const { results = [] } = this.result;
    return results;
  }

  /**
   * 检查搜索功能是否正常运行。
   * 通过执行一个简单的搜索来验证API密钥和连接。
   * @returns {Promise<{status: string, message: string}>} 返回包含状态和消息的对象。
   */
  async check() {
    try {
      // 尝试执行一个非常简单的搜索，只获取一个结果
      const testQuery = "test connection";
      const response = await axios.post(this.baseUrl, {
        query: testQuery,
        max_results: 1,
        search_depth: 'basic'
      }, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // 如果API返回200，即使没有结果，也认为连接成功
        return { status: 'success', message: 'Tavily Search API connection successful.' };
      } else {
        return { status: 'fail', message: `Tavily Search API returned status: ${response.status}` };
      }
    } catch (error) {
      if (error.response) {
        // API返回了错误响应（例如401，403，404等）
        if (error.response.status === 401) {
          return { status: 'fail', message: 'Tavily Search API key is invalid or unauthorized.' };
        } else {
          return { status: 'fail', message: `Tavily Search API error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}` };
        }
      } else if (error.request) {
        // 请求已发出但未收到响应（例如网络问题）
        return { status: 'fail', message: 'No response received from Tavily Search API. Check network connection.' };
      } else {
        // 其他错误
        return { status: 'fail', message: `An unexpected error occurred: ${error.message}` };
      }
    }
  }
}

module.exports = TalivySearch;