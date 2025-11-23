require("module-alias/register");
require("dotenv").config();

const planning_model = 'provider#doubao#doubao-deepseek-v3';
const call = require("@src/utils/llm");
const resolvePlanningPrompt = require("@src/agent/prompt/plan");

const planning = async (goal) => {
  return [
    {
      "id": "1745478628199_692",
      "title": "查找目标Excel文件",
      "description": "Use the terminal_run tool to execute the search command to locate the Excel file about large model application statistics in the working directory",
      "tool": "terminal_run"
    },
    {
      "id": "1745485679318_600",
      "title": "Read the Excel file content",
      "description": "Use the read_file tool to read the content of the confirmed target Excel file",
      "tool": "read_file"
    },
    {
      "id": "1745485679318_601",
      "title": "Generate a web template",
      "description": "Read the file content and use the write_code tool to create a basic HTML template, including the domestic and international screening functions",
      "tool": "write_code"
    },
    {
      "id": "1745485679318_602",
      "title": "Deploy the test environment",
      "description": "Use the terminal_run tool to start the local test server",
      "tool": "terminal_run"
    },
    // {
    //   "title": "Function verification",
    //   "description": "Use the BrowserCode tool to thoroughly test the filtering functions and link jump of the web page",
    //   "tool": "BrowserCode"
    // }
  ]
  const prompt = await resolvePlanningPrompt(goal);
  const content = await call(prompt, planning_model);
  console.log("\n==== conclusion result ====");
  console.log(content);
  return content;
};

module.exports = exports = planning;
