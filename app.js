const Koa = require('koa');
const app = new Koa();
const path = require('path');
const ip = require('ip').address();
const cors = require('koa2-cors');
const body = require('koa-body');
const logger = require('koa-morgan');
const figlet = require('figlet');
const chalk = require('chalk');
const koaStatic = require('koa-static')
const router = require('koa-router')()
const index = require('./routes/index');
// const upload = require('./routes/upload');

// 忽略ssl证书
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());
app.use(logger('combined'));
// 读取静态资源
app.use(koaStatic(path.join(__dirname, 'static')))
app.use(koaStatic(path.join(__dirname, 'upload')))
app.use(body({
	multipart: true,
	strict: false,
	formidable: {
	    // maxFieldsSize: 2 * 1024 * 1024, // 最大文件为2兆
	    multipart: true // 是否支持 multipart-formdate 的表单
	}
}));

// 装载所有路由子路由
router.use('/', index.routes(), index.allowedMethods())
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
	console.log(
		chalk.cyanBright.italic(
			figlet.textSync('Koa-Upload')
		)
	)
	console.log(
		chalk.green.italic(
			`your server is running at http://${ip}:3000`
		)
	);
})