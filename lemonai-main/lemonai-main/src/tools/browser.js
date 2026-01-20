const browser = {
  name: "browser",
  description: "Interact with the browser. Use it ONLY when you need to interact with a webpage.",
  params: {
    type: "object",
    properties: {
      question: {
        description: "What you want to do with a browser",
        type: "string"
      }
    },
    required: ["question"]
  },
  getActionDescription({ question }) {
    return question;
  }
};

module.exports = browser;