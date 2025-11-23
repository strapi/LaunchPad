# LLM 大模型调用封装

## chat/completions SSE 处理逻辑

> 标准参数配置(以 deepseek 为例)

### 请求发起 http.post

- url: https://api.deepseek.com/chat/completions
- key: API_KEY
- model: deepseek-chat

```js
const { url, API_KEY, model, temperature = 0 } = config;
const config = {
  method: "post",
  maxBodyLength: Infinity,
  url,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  data: {
    model, // 调用模型
    messages, // chat 提示词
    stream: true, // 流式输出
    temperature,
  },
  responseType: "stream",
};

const response = await axios.request(config).catch((err) => {
  return err;
});
return response;
```

### 返回消息处理(SSE 流式处理)

- splitter: \n\n
- messageToValue: 读取 JSON.parse(message.split("data:")[1]).choices[0].delta.content

## 代理调用
