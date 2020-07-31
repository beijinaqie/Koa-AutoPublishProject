const index = require('koa-router')();
const ip = require('ip').address();
const shelljs = require('shelljs')
const fs = require('fs');

const list = [
	{
		label: 'appstore',
		value: 'appstore'
	},
	{
		label: 'appstoreadmin',
		value: 'appstoreadmin'
	},
	{
		label: 'market',
		value: 'market'
	},
	{
		label: 'marketadmin',
		value: 'marketadmin'
	},
	{
		label: 'competition',
		value: 'competition'
	},
	{
		label: 'competitionadmin',
		value: 'competitionadmin'
	},
	{
		label: 'edge',
		value: 'edge'
	}
]

index.get('list', async ctx => {
	ctx.body = {
		code: 200,
		data: list,
		success: true,
		msg: 'success'
	}
})

index.post('upload', async ctx => {
	shelljs.echo('开始删除upload下面的文件...');
	shelljs.rm('-rf', 'upload/*') // 删除之前上传的文件
	const file = ctx.request.files.file	// 获取上传文件
	const reader = fs.createReadStream(file.path)	// 创建可读流
	const fileName = file.name
	const upStream = fs.createWriteStream(`upload/${fileName}`)		// 创建可写流
	reader.pipe(upStream)	// 可读流通过管道写入可写流
	shelljs.echo(`${fileName} 读写完成`);
	
	ctx.body = {
		code: 200,
		data: {
			fileName: fileName,
			size: file.size,
			url: `http://${ip}:3000/${fileName}`
		},
		success: true,
		msg: '上传成功'
	};
})

index.post('update', async ctx => {
	
	const ret = shelljs.find(`upload/${ctx.request.body.name}.zip`)
	try{
		if (ret.code !== 0) throw new Error(`Cannot find ${ctx.request.body.name}`)
		shelljs.echo(`开始删除${ctx.request.body.name}文件...`);
		shelljs.rm('-rf', `../${ctx.request.body.name}`)
		shelljs.exec(`unzip upload/${ctx.request.body.name}.zip`)
		shelljs.echo('正在复制文件到指定位置...');
		shelljs.mv(`${ctx.request.body.name}`, '../')
		// shelljs.cp('-R', 'upload/', '../')
		shelljs.echo('项目已更新');
		
		ctx.body = {
			code: 200,
			data: null,
			success: true,
			msg: `${ctx.request.body.name}已更新`
		}
	}catch(e){
		//TODO handle the exception
		ctx.body = {
			code: 200,
			data: null,
			success: false,
			msg: `找不到${ctx.request.body.name}.zip`
		}
	}
})

module.exports = index