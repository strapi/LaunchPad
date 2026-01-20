const router = require('koa-router')() // Import router function   
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'chataa',
        version: '1.0.0',
        description: 'API',
    },
};
const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '../routers/*/*.js')], // Write the address where the router with annotations is stored, best path.join()
};
const swaggerSpec = swaggerJSDoc(options)
// Get the generated annotations file through the router
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
module.exports = router