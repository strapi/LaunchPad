// action_execution_server.js

console.log('[DEBUG] Script started (top of file).'); // 新增

const Koa = require('koa');
const argv = require('minimist')(process.argv.slice(2));
const { koaBody } = require('koa-body');
const terminal_run = require('./terminal_run');
const browser = require('./browser')
const path = require('path');
const { run: vscode_init } = require('./plugins/vscode/index');
const { run: browser_init } = require('./plugins/browser/index');
const { getDirpath } = require('./utils/electron');
const WORKSPACE_DIR = getDirpath(process.env.WORKSPACE_DIR || 'workspace');

// Create Koa application instance
const app = new Koa();

// Register koaBody middleware first to parse POST request body
app.use(koaBody({
  multipart: true
}));

// Route handling
app.use(async ctx => {
  if (ctx.method === 'POST' && ctx.path === '/execute_action') {
    console.log(ctx.request.body)
    const { action, uuid } = ctx.request.body

    let result
    switch (action.type) {
      case 'terminal_run':
        action.params.cwd = path.resolve(__dirname, WORKSPACE_DIR, action.params.cwd || '.');
        result = await terminal_run(action, uuid);
        break;
      case 'browser':
        result = await browser(action, uuid);
        break;
      default:
        break;
    }

    ctx.body = {
      message: 'Received POST /action',
      data: result
    };
  } else {
    ctx.body = 'Koa server is running!';
  }
});

console.log('[DEBUG] Before async initialization block.'); // 新增

(async () => {
  console.log('[DEBUG] Inside async initialization block.'); // 新增
  try {
    const vscode_port = argv.vscode_port || 3001;
    console.log(`[ACTION_EXECUTION_SERVER] Attempting to initialize VS Code on port ${vscode_port}...`);
    await vscode_init('root', vscode_port);
    console.log('[ACTION_EXECUTION_SERVER] VS Code initialized successfully.');

    console.log('[ACTION_EXECUTION_SERVER] Attempting to initialize browser server on port 9000...');
    const browserInitResult = await browser_init('root', 9000);
    console.log('[ACTION_EXECUTION_SERVER] Browser server initialization result:', browserInitResult);
    console.log('[ACTION_EXECUTION_SERVER] Browser server initialized successfully.');

  } catch (err) {
    console.error('[ACTION_EXECUTION_SERVER] Initialization error caught!');
    console.error('Error message:', err.message);
    if (err.stdout) {
      console.error('Error stdout (from `exec` if any):', err.stdout);
    }
    if (err.stderr) {
      console.error('Error stderr (from `exec` if any):', err.stderr);
    }
    if (err.stack) {
      console.error('Error stack:', err.stack);
    }
    if (err.code) {
      console.error('Error code:', err.code);
    }
    if (err.syscall) {
      console.error('Error syscall:', err.syscall);
    }
  } finally {
    // 无论成功或失败都会执行，确保能看到这个日志
    console.log('[DEBUG] Async initialization block finished (or caught error).'); // 新增
  }
})();

const port = argv.port || argv.p || 3000;

console.log('[DEBUG] Before app.listen.'); // 新增

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});