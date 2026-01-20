require('module-alias/register');
require('dotenv').config();
const resolvePlanPrompt = require('@src/agent/prompt/plan');

const run = async () => {
  const goal = 'Read and analyze the Excel file about large model application statistics in the working directory, display its contents on a web page, support filtering between domestic and international entries, and provide access to corresponding official website links and API platform links';  
  const prompt = await resolvePlanPrompt(goal);
  console.log(prompt);
}

run();