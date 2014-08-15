// 'use strict';
var util = require('util');
var path = require('path');
var ClamLogo = require('../app/logo').ClamLogo;
var os = require('os');
var ABC = require('abc-generator');

var AppGenerator = module.exports = function AppGenerator(args, options, config) {
	ABC.UIBase.apply(this, arguments);

    this.on('end', function () {
		//helper.info();
    }.bind(this));

};

util.inherits(AppGenerator, ABC.UIBase);

AppGenerator.prototype.askFor = function askFor() {
	var cb = this.async();
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
	
	var txt = [
		'',
		'clam@v'+this.pkg.version,
		'node@v'+process.version.substring(1),
		'os@'+os.type() + ' ' + os.release(),
		'',
		'Yeoman 命令',
		'	yo clam:h	显示帮助',
		'	yo clam		在根目录执行，初始化Project',
		'	yo clam:mod	在mods目录中执行，生成一个模块',
		'	yo clam:page	在pages目录中执行，生成PC页面',
		'	yo clam:h5	在pages中执行，生成一个H5页面',
		'	yo clam:pi	生成一个PI标准格式组件（需要手动先创建目录）',
		'',
		'Grunt 命令',
		'	grunt		在daily/x.y.z的分支中执行默认构建流程',
		'	grunt build	执行默认构建流程',
		'	grunt demo	启动Demo预览服务',
		'	grunt debug	启动Debug调试服务',
		'	grunt offline	启动离线包调试服务',
		'	grunt newbranch	生成一个新的分支（daily/x.y.(z+1)）',
		'	grunt prepub	资源文件预发',
		'	grunt publish	资源文件发布',
		'	grunt daily	将build目录中的html里资源引用替换为daily，用以awpp发布到日常和预发',
		'	grunt zip	将build_offline打成zip包',
		'',
		'AWP 命令',
		'	awpp		在项目根目录执行，发布build/pages里的html文件',
		'	awpp config	配置本地用户名和token',
		'	awpp --help	awpp命令帮助',
		'',
		'工具文档：https://github.com/jayli/generator-clam',
		'author by @拔赤,@弘树'
	].forEach(function(item){
		console.log(item);
	});
	// helper.info();
};

