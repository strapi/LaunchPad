require('module-alias/register');
require('dotenv').config();

const planning = require('./index');

const run = async () => {
  const goal = 'Read and analyze the Excel file about large model application statistics in the working directory, display its contents on a web page, support filtering between domestic and international entries, and provide access to corresponding official website links and API platform links';  
  const result = await planning(goal);
  console.log(result);

  process.exit(0);
}

run();