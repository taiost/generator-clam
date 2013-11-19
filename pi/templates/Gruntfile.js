module.exports = function(grunt) {
	var task = grunt.task;
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('abc.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: '../'
                    }
                ],
                map: [["<%= pkg.name %>/", "gallery/<%= pkg.name %>/"]]
            },
            main: {
                files: [
                    {
                        src: "<%= pkg.version %>/index.js",
                        dest: "<%= pkg.version %>/build/index.js"
                    }
                ]
            }
        },
		// FlexCombo服务配置
		// https://npmjs.org/package/grunt-flexcombo
		//
		// 注意：urls 字段末尾不能有'/'
		flexcombo:{
			server:{
				options:{
					proxyport:8080,
					target:'./',
					urls:'/s/kissy/gallery/<%= pkg.name %>',
					port:'80',
					servlet:'?',
					separator:',',
					charset:'utf8'
				}
			}
		},
		// 监听JS、CSS、LESS文件的修改
        watch: {
            'all': {
                files: ['src/**/*._empty'],
                tasks: ['kmc']
            }
		}
    });

	grunt.registerTask('server', '开启Demo调试模式', function() {
		task.run(['flexcombo:server','watch:all']);
	});

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-kmc');
	grunt.loadNpmTasks('grunt-flexcombo');
    return grunt.registerTask('default', ['kmc']);
};
