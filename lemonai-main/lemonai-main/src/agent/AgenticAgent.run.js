require('module-alias/register');
require('dotenv').config();
// https://github.com/GoogleChromeLabs/ndb

const AgenticAgent = require("./AgenticAgent")

const run = async () => {
  const agent = new AgenticAgent();
  const r = await agent.run("Please read and analyze the Excel file about large model application statistics in the working directory, display its contents on a web page, support filtering between domestic and international entries, and provide access to corresponding official website links and API platform links");
  // console.log(r);
  process.exit(0);
}

run();