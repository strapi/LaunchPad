const router = require("koa-router")();

router.prefix("/api/default_model_setting");

const modules = [
  "default_model_setting",
]

for (const module of modules) {
  try {
    router.use(require(`./${module}.js`));
  }
  catch (error) { console.log(`load ${module} error`, error); }
}

module.exports = router.routes();
