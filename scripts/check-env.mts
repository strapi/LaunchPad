import { checkEnv, reportCheck } from './env.mjs';

const result = checkEnv();
reportCheck(result);
process.exit(result.ok ? 0 : 1);
