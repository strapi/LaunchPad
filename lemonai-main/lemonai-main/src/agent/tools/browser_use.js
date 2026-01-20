const BrowserCode = {
  name: "browser_use",
  description: "Use the headless browser to access the specified URL, and optionally execute the provided JavaScript code snippet to extract or interact with page content.",
  params: {
    type: "object",
    properties: {
      url: {
        description: "The target website URL to visit.",
        type: "string"
      },
      browser_code: {
        description: "The JavaScript code snippet to execute in the page context,用于提取信息或与页面交互。代码应返回值。",
        type: "string"
      }
    },
    required: ["url", "browser_code"]
  }
};

module.exports = BrowserCode;