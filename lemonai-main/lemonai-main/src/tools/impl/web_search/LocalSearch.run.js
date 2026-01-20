
const LocalSearchServer  = require('./LocalSearch');

(async () => {
  try {
    // 打开多个 URL，复用 browser 和 context
    // const result = await LocalSearchServer.search('Travel to Japan in April',{ uid: 'user1',max_results: 3 , engine : 'bing'});
    // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    const tools = new LocalSearchServer()
    const result = await tools.search('DeepSeek对比Grok',{ uid: 'user1',max_results: 10 , engine : 'baidu'});
    let r = await tools.formatContent()
    console.log(r)
    /**
    输入示例：
    args:
      query: string
      options: {
        uid: string, // 用户 ID default: 'default'
        max_results: number, // 最大结果数 default: 3
        engine: string, // 搜索引擎 bing or baidu; default: 'bing'
       }
    输出示例：
    args:
      result:{
        query: string
        results: list of { title: string, url: string, content: string }
      };
     
     */
    //console.log('结果', result);
    // // 保存 HTML 到文件temp.html


    console.log('\n\n\n-------------------------------------------------------------------------------------------------------------------------------------');
    console.log('Closed user1 context.');
    // 清理所有资源
    await tools.cleanup();
  } catch (error) {
    console.error('Error:', error);
  }
})();