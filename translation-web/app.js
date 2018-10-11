const Koa = require('koa')
const Router = require('koa-router')()
const body = require('koa-body')
const static = require('koa-static')
const path = require('path')
const api = require('./routes/api')
const log = require('./log')

// 引入config
global.config = require('./config.js')

const app = new Koa()

// middlewares
app.use(body())
app.use(static(
    path.join(__dirname, global.config.staticPath)
))
app.use(Router.routes(), Router.allowedMethods())

// router
Router.use('/api', api.routes(), api.allowedMethods())

// 监听端口
app.listen(global.config.port, () => {
    console.log(`Server listening on port ${global.config.port}.`);
})