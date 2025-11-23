const { PassThrough } = require("stream");
const { v4: uuidv4 } = require("uuid");

const handleStream = (responseType = 'sse', response, debug = true) => {
  const stream = new PassThrough();
  let onTokenStream = new Function();

  if (responseType === "openai-sse") {
    // 设置响应头 response
    response.type = "text/event-stream";
    response.set("Cache-Control", "no-cache");
    response.set("Connection", "keep-alive");
    onTokenStream = (token, model = "gpt") => {
      debug && process.stdout.write(token);
      if (typeof token === "object") {
        token = JSON.stringify(token);
      }
      const encoded = JSON.stringify({
        id: uuidv4(),
        object: "chat.completion.chunk",
        created: parseInt((Date.now() / 1000).toFixed(0)),
        model: model,
        choices: [
          {
            index: 0,
            delta: { role: "assistant", content: token },
            finish_reason: null,
          }
        ]
      });
      stream.write(`data: ${encoded}\n\n`);
    };
  }

  if (responseType === 'sse') {
    // 设置响应头 response
    response.type = "text/event-stream";
    response.set("Cache-Control", "no-cache");
    response.set("Connection", "keep-alive");
    onTokenStream = (token) => {
      // console.log('token', token);
      if (typeof token === 'object') {
        token = JSON.stringify(token);
        debug && process.stdout.write(token);
      }
      const encoded = Buffer.from(token).toString("base64");
      // const encoded = token;
      stream.write("event: message\n");
      stream.write(`data: ${encoded}\n\n`);
    };
  }

  if (responseType === 'stream') {
    // 设置响应头
    response.set("Content-Type", "text/plain");
    response.set("Transfer-Encoding", "chunked");
    onTokenStream = (token) => {
      stream.write(token);
    };
  }

  return { stream, onTokenStream };
}

module.exports = exports = handleStream