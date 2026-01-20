const router = require("koa-router")();

router.prefix("/api/model");

const modules = [
  "model",
]

for (const module of modules) {
  try {
    router.use(require(`./${module}.js`));
  }
  catch (error) { console.log(`load ${module} error`, error); }
}

module.exports = router.routes();
