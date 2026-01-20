const { get_encoding, encoding_for_model } = require("@dqbd/tiktoken");

const calcToken = (text, modelName = "gpt-3.5-turbo") => {
  const enc = encoding_for_model(modelName);
  const inputs = enc.encode(text);
  enc.free();
  return inputs.length
}

module.exports = exports = calcToken;

// const len = calcToken("hello world");
// console.log(len); 