require('module-alias/register');
require('dotenv').config();
const resolveToolPrompt = require('@src/agent/prompt/tool');

const run = async () => {
  const prompt = await resolveToolPrompt();
  console.log(prompt);
}

run();