const router = require("koa-router")();

router.prefix("/api/conversation");

const modules = [
  "conversation",
  "favorite"
]

for (const module of modules) {
  try {
    router.use(require(`./${module}.js`));
  }
  catch (error) { console.log(`load ${module} error`, error); }
}

module.exports = router.routes();
