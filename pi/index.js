// 'use strict';
var util = require('util');
var path = require('path');
var ClamLogo = require('../app/logo').ClamLogo;
var yeoman = require('yeoman-generator');
var ABC = require('abc-generator');
var promise = require('promise');
var exec = require('child_process').exec;

//一个不阻断异步链基于promise的_exec
var _exec = function (cmd, options) {
    options = options || {}
    return new promise(function (resolve, reject) {
        exec(cmd, options, function (err, stdout, stderr) {
            if (err) {
                console.log(cmd, 'ERROR : ', err);
                resolve(stderr);
            } else {
                resolve(stdout);
            }
        });
    })
}


var AppGenerator = module.exports = function AppGenerator(args, options, config) {
    // yeoman.generators.Base.apply(this, arguments);
    ABC.UIBase.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
        console.log(yellow('\n\nplease run "npm install" before grunt\n'));
        console.log(green('\ndone!\n'));
    }.bind(this));

};

util.inherits(AppGenerator, ABC.UIBase);

AppGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    //获取当前用户git的用户名作为author
    promise.all([
            _exec('git config user.name', {cwd: __dirname}),
            _exec('git config user.email', {cwd: __dirname})
        ]).then(function (res) {
            this.gitUserName = res[0];
            this.gitUserEmail = res[1];
            cb();
        },function (err){
            this.gitUserName = '';
            this.gitUserEmail = '';
            cb();
        });
    // welcome message



    console.log(ClamLogo(this));

    var folderName = path.basename(process.cwd());

    var author = {
        name : 'kissy-team',
        email: 'kissy-team@gmail.com'
    };

    if (this.abcJSON && this.abcJSON.author) {
        var abcAuthor = this.abcJSON.author;
        author.name = abcAuthor.name || 'kissy-team';
        author.email = abcAuthor.email || 'kissy-team@gmail.com';
    }
    this.author = '';
    this.email = '';
    this.version = 't';
    this.folderName = folderName;
    this.componentName = getComponentName();
    this.comConfig = comConfig(this);

};

AppGenerator.prototype.files = function files() {


    // 创建目录
    var fold = ['demo', 'build', 'guide'];
    for (var i = 0; i < fold.length; i++) {
        this.mkdir(fold[i]);
    }

    // 创建项目文件
    this.template('index.js', 'index.js');
    this.template('index.md', path.join('guide', 'index.md'));
    this.template('index.html', path.join('demo', 'index.html'));

    // 全局文件
    this.copy('Gruntfile.js', 'Gruntfile.js');
    this.copy('_.gitignore', '.gitignore');
    this.template('abc.json', 'abc.json');
    this.template('_package.json', 'package.json');
    this.template('README.md', 'README.md');


};

function consoleColor(str, num) {
    if (!num) {
        num = '32';
    }
    return "\033[" + num + "m" + str + "\033[0m"
}

function green(str) {
    return consoleColor(str, 32);
}

function yellow(str) {
    return consoleColor(str, 33);
}

function red(str) {
    return consoleColor(str, 31);
}

function blue(str) {
    return consoleColor(str, 34);
}


function comConfig(that) {
    var comConfig = {};
    var folderName = path.basename(process.cwd());
    comConfig.name = folderName;
    comConfig.componentClass = parseMojoName(folderName);
    return comConfig;
}

function parseMojoName(name) {
    return name.replace(/\b(\w)|(-\w)/g, function (m) {
        return m.toUpperCase().replace('-', '');
    });
}

function getComponentName() {
    var folderName = path.basename(process.cwd());
    return parseMojoName(folderName);
}
