/**
 * 本文件是 Gruntfile.js 默认模板，请根据需要和注释提示自行修改
 * 从这里获得最新版
 * https://github.com/jayli/generator-clam/blob/master/app/templates/Gruntfile_src.js
 * 文档地址:
 * http://cnpmjs.org/package/generator-clam
 */
var path = require('path'),
	tmsid = 0,
	clamUtil = require('clam-util'),
	exec = require('child_process').exec;

module.exports = function (grunt) {
	require('time-grunt')(grunt);

	var file = grunt.file;
	var task = grunt.task;
	var pathname = path.basename(__dirname);
	var source_files = clamUtil.walk('src',
		clamUtil.NORMAL_FILTERS,
		clamUtil.NORMAL_EXFILTERS);
	var all_files = (source_files.css || [])
		.concat(source_files.eot || [])
		.concat(source_files.otf || [])
		.concat(source_files.svg || [])
		.concat(source_files.ttf || [])
		.concat(source_files.woff || [])
		.concat(source_files.html || [])
		.concat(source_files.htm || [])
		.concat(source_files.js || [])
		//.concat(source_files.less || [])
		.concat(source_files.css || [])
		.concat(source_files.png || [])
		.concat(source_files.gif || [])
		.concat(source_files.jpg || [])
		//.concat(source_files.scss || [])
		.concat(source_files.php || [])
		.concat(source_files.swf || []);

	// -------------------------------------------------------------
	// 任务配置
	// -------------------------------------------------------------

	// 如果 Gruntfile.js 编码为 gbk，打开此注释
	// grunt.file.defaultEncoding = 'gbk';
	var base = 'http://g.tbcdn.cn';
	var Gpkg = grunt.file.readJSON('abc.json');
	var isH5 = (Gpkg.isH5 === "true");
	grunt.initConfig({

		// 从 abc.json 中读取配置项
		abcpkg: grunt.file.readJSON('abc.json'),

		// 配置默认分支
		currentBranch: 'master',

		// 对build目录进行清理
		clean: {
			build: {
				src: 'build/*'
			},
            offline: {
                src: 'build_offline/*'  
            },
			zip:{
				src: 'build_offline.zip'
			},
			'main_tms_html':{
				src : 'build/pages/**/*.tms.html'
			},
			'offline_tms_html':{
				src : 'build_offline/pages/**/*.tms.html'
			},
			'offline_mods':{
				src : 'build_offline/mods/**/*.html'
			},
            mods: {
                src: 'src/map.js'
            }
		},

		/**
		 * 将src目录中的KISSY文件做编译打包，仅解析合并，源文件不需要指定名称
		 *        KISSY.add(<名称留空>,function(S){});
		 *
		 *        @link https://github.com/daxingplay/grunt-kmc
		 *
		 * 如果只需要合并,使用这个配置
		 options: {
                packages: [
                    {
                        name: '<%= abcpkg.name %>',
                        path: '../',
						charset:'utf-8'
                    }
                ],
				map: [['<%= abcpkg.name %>/src/', '<%= abcpkg.name %>/']]
            },
		 main: {
                files: [
                    {
                        expand: true,
						cwd: 'src/',
                        src: source_files.js,
                        dest: 'build/'
                    }
                ]
            }
		 */
		kmc: {
			options: {
				packages: [
					{
						name: '<%= abcpkg.name %>',
						path: './src/',
						charset: 'utf-8',
						ignorePackageNameInUri: true
					}
				],
				depFilePath: 'build/map.js',// 生成的模块依赖表
				comboOnly: true,
				fixModuleName: true,
				copyAssets: true,
				comboMap: true
			},
			main: {
				files: [
					{
						src: [ 'src/**/*.js', 
								'!src/widgets/libs/seed.js',
								'!src/libs/seed.js',
								'!src/widgets/kissy/**/*',
								'!src/**/*/Gruntfile.js'],
						dest: 'build/'
					}
				]
			}
		},
		'inline-assets':{
			main:{
				options:{
					encoding:'utf8',
					// 本地文件引用替换为线上地址
					// KISSY Modules Maps File 地址
					//comboMapFile: '../../map.js'
					comboMapFile: false,
					jsmin: true
				},
                files: [
                    {
                        expand: true,
						cwd:'build',
                        src: ['pages/**/*.html'],
                        dest: 'build/'
                    }
                ]
			},
			offline:{
				options:{
					encoding:'utf8',
					// 只替换绝对地址引用的文件 
					onlineFileSSIOnly:true
				},
                files: [
                    {
                        expand: true,
						cwd:'build_offline',
                        src: ['pages/**/*.html'],
                        dest: 'build_offline/'
                    }
                ]

			}
		},

		/*------------------------------------*\
			# HTML标签规范检查
		\*------------------------------------*/
		htmlhint: {
			options: {
				htmlhintrc: '.htmlhintrc'
			},
			html: {
				src: ['src/**/*.html']
			}
		},

		// 静态合并HTML和抽取JS/CSS，解析juicer语法到vm/php
		// https://npmjs.org/package/grunt-combohtml
		combohtml: {
			main: {
				options: {
					encoding: 'utf8',
					replacement: {
						from: /src\//,
						to: 'build/'
					},
					// assetseParser: !isH5, // 参照TIP@2014-8-15
					// 本地文件引用替换为线上地址
					relative: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/',
					combineAssets: true, // 配合relative使用,将页面中所有以CDN引用的JS/CSS文件名进行拼合
					// KISSY Modules Maps File 地址
					// comboMapFile: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/map-min.js',
					tidy: false,  // 是否重新格式化HTML
					// TODO:改成True时juicerMock函数有bug
					mockFilter: true, // 是否过滤Demo中的JuicerMock
					comboJS: false, // 是否静态合并当前页面引用的本地js为一个文件
					comboCSS: false, // 是否静态合并当前页面引用的css为一个文件
					convert2vm: false,// 是否将juicer语法块转换为vm格式
					convert2php: false, // 是否将juicer语法块转换为php格式
					comboExt: '-combo', // 静态合并后的js和css后缀
					//htmlProxy: '<%= abcpkg.htmlProxy %>',      // htmlProxy 配置，用于产出线上页面区块替换为本地模块页面
					//htmlProxyDestDir: 'html-fragments',      // html 代理区块页面生成到的目标目录
					meta : {
						'pageid' : 'on181.<%= abcpkg.name%>/${path|regexp,"build/",""}'
					}
				},
				files: [
					{
						expand: true,
						cwd: 'build',
						// 对'*.html'文件进行HTML合并解析
						src: ['pages/**/*.html','!pages/**/*.tms.html'],
						dest: 'build/'
					}
				]
			},
			offline:{
				options: {
					encoding: 'utf8',
					replacement: {
						from: /src\//,
						to: 'build_offline/'
					},
					assetseParser: false,
					combineAssets: false, 
					// KISSY Modules Maps File 地址
					comboMapFile: false,
					tidy: false,  // 是否重新格式化HTML
					mockFilter: true, // 是否过滤Demo中的JuicerMock
					comboJS: false, // 是否静态合并当前页面引用的本地js为一个文件
					comboCSS: false, // 是否静态合并当前页面引用的css为一个文件
					convert2vm: false,// 是否将juicer语法块转换为vm格式
					convert2php: false, // 是否将juicer语法块转换为php格式
					meta : {
						'pageid' : 'off181.<%= abcpkg.name%>/${path|regexp,"build_offline/",""}'
					}
				},
				files: [
					{
						expand: true,
						cwd: 'build_offline',
						src: ['pages/**/*.html','!pages/**/*.tms.html'],
						dest: 'build_offline/'
					}
				]

			}
		},
		// convert juicer+mockdata to tms format
		// https://npmjs.org/package/grunt-tms
		tms: {
			options: {
				DEFAULT_TITLE: '新默认标题',
				DEFAULT_GROUP: '新默认组',
				DEFAULT_ROW: 2,             // 对列表数据，默认行数，对应"defaultRow"属性
				DEFAULT_MAXROW: 6,          // 对列表数据，默认最大行数，对应"row"属性
				THRESHOLD_MULTISTRING: 2    // 判断为多行文本的阈值：字符串中包含2个以上的标点符号
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'build',
						// 对'*.tms'文件进行juicer2tms转换
						src: ['**/*.tms.html'],
						dest: 'build/',
						ext: '.tms'
					}
				]
			}
		},
		// FlexCombo服务配置
		// https://npmjs.org/package/grunt-flexcombo
		//
		// 注意：urls 字段末尾不能有'/'
		flexcombo: {
			// 源码调试服务
			server: {
				options: {
					proxyport: '<%= abcpkg.proxyPort %>',               // 本地反向代理端口
					target: 'src/',                                     // flex-combo 要代理的目录
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',    // flex-combo 要代理的匹配 url
					port: '<%= abcpkg.port %>',                         // 本地服务端口
					proxyHosts: [                                       // 本地反向代理需要代理的主机名
						'demo', 
						'demo.com',
						'dev.waptest.taobao.com', 
						'dev.wapa.taobao.com',
						'dev.m.taobao.com'
					],
					servlet: '?',
					separator: ',',
					charset: 'utf8',
					startWeinre: isH5,                                  // 是否自动启动 weinre（H5项目默认为 true）
					weinrePort: 8091,                                   // weinre 运行端口号
					proxy: {                                            // 代理配置
						interface: {                                    // 接口 mock 配置
							hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],   // 接口 mock 要代理的主机名
							script: 'proxy/interface.js'                // 接口 mock 的执行脚本路径
						},
						webpage: {
							urls: [/*/taobao\.com/*/],                  // 页面代理需要代理的 url 模式（字符串/正则表达式）
							script: 'proxy/webpage.js'                  // 页面代理执行脚本路径
						}
					}
				}
			},
			// 目标代码调试服务
			debug: {
				options: {
					// 无线H5项目调试，可打开host配置，用法参照
					// https://speakerdeck.com/lijing00333/grunt-flexcombo
					target: 'build/',
					proxyport: '<%= abcpkg.proxyPort %>', // 反向代理绑定当前主机的 proxyport 端口
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>',
					port: '<%= abcpkg.port %>',
					// 反向代理时本地虚机域名强制定向到本机
					htmlProxy: '<%= abcpkg.htmlProxy %>',
					// 本机虚机域名
					proxyHosts: [
						'demo', 
						'demo.com', 
						'h5.m.taobao.com',
						'm.trip.taobao.com'
					],
					servlet: '?',
					separator: ',',
					charset: 'utf8',
					startWeinre: isH5,
					weinrePort: 8091,
					proxy: {
						interface: {
							hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],
							script: 'proxy/interface.js'
						},
						webpage: {
							urls: [/*/taobao\.com/*/],
							script: 'proxy/webpage.js'
						}
					},
					hosts: {
						"g.assets.daily.taobao.net": "10.235.136.37"
					},
					filter: {
						'-min\\.js': '.js',
						// 访问 h5.m.taobao.com/trip/h5-trains/search/index.html
						// 将重定向到 ./build/pages/search/index.html
						// Example: '(.+)/trip/h5-car/\(.+\\.\)html':'$1/pages/$2html'
						'(.+)/trip/[^\/]+/\(.+\\.\)html': '$1/pages/$2html'
					}
				}
			},
			// 离线包调试模式 
			offline: {
				options: {
					// 无线H5项目调试，可打开host配置，用法参照
					// https://speakerdeck.com/lijing00333/grunt-flexcombo
					target: 'build_offline/',
					proxyport: '<%= abcpkg.proxyPort %>',
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',
					port: '<%= abcpkg.port %>',
					// 本机虚机域名
					proxyHosts: [
						'demo', 
						'demo.com', 
						'dev.waptest.taobao.com', 
						'dev.wapa.taobao.com',
						'h5.m.taobao.com'
					],
					servlet: '?',
					separator: ',',
					charset: 'utf8',
					startWeinre: isH5,
					weinrePort: 8091,
					proxy: {
						interface: {
							hosts: ['api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'],
							script: 'proxy/interface.js'
						},
						webpage: {
							urls: [/*/taobao\.com/*/],
							script: 'proxy/webpage.js'
						}
					},
					filter:{
						// 将visa更换为你线上域名的目录名
						'(.+)/trip/visa/\(.+\\.\)html':'$1/pages/$2html',
						'(.+)/trip/visa/\(.+\\.\)(css|js)':'$1/pages/$2$3',
						'(.+)/trip/\(.+\\.\)(js|css|png|jpg|gif)':'$1/$2$3',
					}
				}
			}
		},

		less: {
			options: {
				strictImports: true
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.less'],
						dest: 'build/',
						ext: '.css'
					}
				]
			}
		},

		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.scss'],
						dest: 'build/',
						ext: '.css'
					}
				]
			}
		},

		// 压缩JS https://github.com/gruntjs/grunt-contrib-uglify
		uglify: {
			options: {
				banner: '/*! Generated by Clam: <%= abcpkg.name %> */\n',
				beautify: {
					ascii_only: true
				}
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.js', '!**/*-min.js'],
						dest: 'build/',
						ext: '-min.js'
					}
				]
			},
            offline: {
                files: [
                    {
                        expand: true,
                        cwd: 'build_offline/',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: 'build_offline/'
                    }
                ]
            }
		},

		// 压缩CSS https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: ['**/*.css', '!**/*-min.css', '!**/*.less.css', '!**/*.scss.css'],
						dest: 'build/',
						ext: '-min.css'
					}
				]
			},
            offline: {
                files: [
                    {
                        expand: true,
                        cwd: 'build_offline/',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: 'build_offline/',
                    }
                ]
            }
		},

		// 监听JS、CSS、LESS文件的修改
		watch: {
			'all': {
				options: {
					livereload: true
				},
				files: ['src/**/*.js',
					'src/**/*.css',
					'src/**/*.less',
					'src/**/*.php',
					'src/**/*.html',
					'src/**/*.htm',
					'src/**/*.scss',
					'!src/**/node_modules/**/*',
					'!src/**/build/**/*'],
				tasks: [ 'exec_build' ]
			}
		},

		// 发布命令
		exec: {
			tag: {
				command: 'git tag publish/<%= currentBranch %>'
			},
			publish: {
				command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
			},
			commit: {
				command: function (msg) {
					var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
					return command;
				}
			},
			add: {
				command: 'git add . -A'
			},
			prepub: {
				command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
			},
			grunt_publish: {
				command: 'grunt default:publish'
			},
			grunt_prepub: {
				command: function (msg) {
					return 'grunt default:prepub:' + msg;
				}
			},
			new_branch: {
				command: 'git checkout -b daily/<%= currentBranch %>'
			},
            zip: {
                command: 'cd build_offline/; zip -r9 ../build_offline.zip *; cd ../'
            }
		},

		// 将css文件中引用的本地图片上传CDN并替换url，默认不开启
		mytps: {
			options: {
				argv: "--inplace"
			},
			expand: true,
			cwd: 'src',
			all: source_files.css
		},
        cacheinfo:{
            options:{
                abc:"abc.json",
                src:"src",
                dest:"build_offline/cache_info.json"
            }
        },
		// 拷贝文件
		copy: {
			main: {
				files: [
					{
						expand: true,
						src: all_files.concat([
							//'!**/build/**/*',
                            '!**/demo/**/*',
                            '!**/docs/**/*',
                            '!**/guide/**/*',
                            '!**/img/**/*',
                            '!**/image/**/*',
                            '!**/tests/**/*',
                            '!**/src/**/*',
                            '!**/doc/**/*'
						]),
						dest: 'build/',
						cwd: 'src/',
						filter: 'isFile'
					}
				]
			},
            mods: {
                files: [
                    {
                        expand:true,
                        src: 'map.js', 
                        dest: 'src/',
                        cwd:'build/'
                    }
                ]
            },
            offline_jscss: {
                files: [
                    {
                        expand:true,
                        src: [
                            '**/*.js', '**/*.css', 
                            '!**/*-min.js', '!**/*-min.css', 
                            //'!**/build/**/*.js', '!**/build/**/*.css', 
                            '!**/demo/**/*.js', '!**/demo/**/*.css', 
                            '!**/docs/**/*.js', '!**/docs/**/*.css'
                        ],
                        dest: 'build_offline/',
                        cwd:'build/'
                    },
					{
						expand:true,
						src:['widgets/wlog/build/*.js'],
						dest:'build_offline/',
						cwd: 'src/'
					}
                ]
            },
            offline_html: {
                files: [
                    {
                        expand:true,
                        src: ['pages/**/*.html','mods/**/*.html'],
                        dest: 'build_offline/',
                        cwd:'src/'
                    }
                ]
            }
		},
		// 替换config中的版本号@@version
		replace: {
			daily: {
				options: {
					variables: {
						'g.tbcdn.cn': 'http://g.assets.daily.taobao.net'
					},
					prefix: 'http://'
				},
				files: [
					{
						expand: true,
						cwd: 'build/',
						dest: 'build/',
						src: ['pages/**/*.html']
					}
				]
			},
			dist: {
				options: {
					variables: {
						'version': '<%= abcpkg.version %>'
					},
					prefix: '@@'
				},
				files: [
					{
						expand: true,
						cwd: 'build/',
						dest: 'build/',
						src: ['*.js','mods/**/*','pages/**/*']
					}
				]
			},
			offline:{
				options: {
					patterns: [
						{
							match:/<\/head>/,
							replacement:[
								'<!--added by clam {{-->\n',
								'<meta name="aplus-offline" content="1">\n',
								'<script src="../../widgets/wlog/build/aplus_wap.js"></script>\n',
								'<script src="../../widgets/wlog/build/spm_wap.js"></script>\n',
								'<script src="../../widgets/wlog/build/spmact_wap.js"></script>\n',
								'<!--added by clam }}-->\n',
								'</head>'
							].join('')
						},
						{
							match: /<!--HTTP:(.*):HTTP-->/g,
							replacement: function(match, tms) {
								var obj = {},
									async;

								if (tms) {
									tms = tms.split(',');
									obj.proxy = 'http://trip.taobao.com/market/trip/h5_offline_service.php';
									obj.src = encodeURIComponent(tms[0].replace(/\?.*$/ig, ''));
									obj.params = tms[0].match(/\?/) ? tms[0].replace(/^.*\?/ig, '') : '';
									obj.charset = tms[1] || 'gbk';
									async = !!obj.params.match(/async/);
									if (async) {
										obj.id = tmsid++;
										return clamUtil.sub('<script id="tms_fragment_{id}">get_tms_fragment("{proxy}?src={src}", "{charset}", "tms_fragment_{id}");</script>', obj);
									} else {
										return clamUtil.sub('<script src="{proxy}?callback=handle_tms_fragment&src={src}" charset="{charset}"></script>', obj);
									}
								} else {
									return match;
								}
							}
						},
						{
							match: /<head>/,
							replacement: [
								'<head>\n',
								'<!--{{ added by clam -->\n',
								'<script>window.MT_CONFIG={offline:true};</script>\n',
								'<script src="../../widgets/tms-offline-parser/index.js"></script>\n',
								'<!--}} added by clam -->'
							].join('')
						}
					]
				},
                files: [
                    {
                        expand: true, 
                        cwd: 'build_offline/',
                        dest: 'build_offline/',
                        src: ['**/*.html']
                    }
                ]
			}
		},

		// juicer 模板编译为 kissy 模块，文档：https://www.npmjs.org/package/grunt-tpl-compiler
		tpl_compiler: {
			options: {
				ext: '-tpl'
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.tpl.html'],
						dest: 'src/'
					}
				]
			}
		}

	});

	// -------------------------------------------------------------
	// 载入模块
	// -------------------------------------------------------------

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-kmc');
	grunt.loadNpmTasks('grunt-mytps');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-flexcombo');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-combohtml');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-tms');
	grunt.loadNpmTasks('grunt-inline-assets');
	grunt.loadNpmTasks('grunt-tpl-compiler');
    grunt.loadNpmTasks('grunt-cacheinfo');

	// -------------------------------------------------------------
	// 注册Grunt子命令
	// -------------------------------------------------------------

	// 预发布
	grunt.registerTask('prepub', 'clam pre publish...', function (msg) {
		var done = this.async();
		clamUtil.getBranchVersion(function(version){
			grunt.log.write(('当前分支：' + version).green);
			grunt.config.set('currentBranch', version);
			task.run(['exec_build']);
			// 预发替换到 daily
			task.run(['replace:daily']);
			task.run(['exec:add', 'exec:commit:' + msg]);
			task.run(['exec:prepub']);
			done();
		});
	});

	// 正式发布
	grunt.registerTask('publish', 'clam 正式发布', function (msg) {
		var done = this.async();
		clamUtil.getBranchVersion(function(version){
			grunt.log.write(('当前分支：' + version).green);
			grunt.config.set('currentBranch', version);
			task.run(['exec_build']);
			task.run(['exec:add', 'exec:commit:' + msg]);
			task.run(['exec:prepub']);
			task.run(['exec:tag', 'exec:publish']);
			done();
		});
	});

	// 启动offline调试时的本地服务
	grunt.registerTask('offline', '开启offline离线包调试模式', function () {
		task.run(['flexcombo:offline', 'watch:all']);
	});


	// 启动Demo调试时的本地服务
	grunt.registerTask('demo', '开启Demo调试模式', function () {
		task.run(['flexcombo:server', 'watch:all']);
	});

	// 启动Debug调试时的本地服务
	grunt.registerTask('debug', '开启debug模式', function () {
		task.run(['flexcombo:debug', 'watch:all']);
	});

	// 替换build里的http://g.tbcdn.cn的引用为daily的引用
	grunt.registerTask('daily', '替换域名引用到daily', function () {
		task.run(['replace:daily']);
	});

	// 默认构建流程
	grunt.registerTask('exec_build', '执行构建脚本', function () {
		var actions = [
			// 构建准备流程
			'htmlhint',
            'clean:build',
            'clean:offline',
			'clean:mods',
			'clean:zip',
			'tpl_compiler',
			'copy:main',
			'less',
			'sass',
			'kmc',
			'copy:mods',
			'tms',
			// 构建在线包
			'combohtml:main',
			'replace:dist',
            'uglify:main',
            'cssmin:main',
			'clean:main_tms_html'
		];
		// TIP,2014-8-15：
		// 根据规范，H5项目应当把所有的assets都inline进来
		// 但由于awpp命令无法根据inline后的大文件计算正确的摘要值而导致发布失败
		// 暂时将这个逻辑去掉，根本原因是awpp计算token的bug
		/*
		if(isH5){
			actions = actions.concat([
				'inline-assets:main'
			]);
		}
		*/
		if(isH5){
			actions = actions.concat([
				// 构建离线包
				'copy:offline_html',
				'combohtml:offline',
				'clean:offline_mods',
				'clean:offline_tms_html',
				'copy:offline_jscss',
				'uglify:offline',
				'cssmin:offline',
				'inline-assets:offline',
				'replace:offline',
				'cacheinfo',
				'exec:zip'
			]);
		}
		task.run(actions);
	});

	// 默认构建任务
	grunt.registerTask('build', ['exec_build']);

    // 压缩离线包
    grunt.registerTask('zip', ['exec:zip']);

	grunt.registerTask('newbranch', '获取当前最大版本号,创建新的分支', function (type, msg) {
		var done = this.async();
		exec('git branch -a & git tag', function (err, stdout, stderr, cb) {
			var versions = stdout.match(/\d+\.\d+\.\d+/ig),
				r = clamUtil.getBiggestVersion(versions);
			if (!r || !versions) {
				r = '0.1.0';
			} else {
				r[2]++;
				r = r.join('.');
			}
			grunt.log.write(('新分支：daily/' + r).green);
			grunt.config.set('currentBranch', r);
			task.run(['exec:new_branch']);
			// 回写入 abc.json 的 version
			try {
				abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
				abcJSON.version = r;
				clamUtil.fs.writeJSONFile("abc.json", abcJSON, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("update abc.json.");
					}
				});
			} catch (e) {
				console.log('未找到abc.json');
			}
			done();
		});
	});

	// -------------------------------------------------------------
	// 注册Grunt主流程
	// -------------------------------------------------------------

	return grunt.registerTask('default', 'Clam 默认流程', function (type, msg) {

		var done = this.async();

		// 获取当前分支
		clamUtil.getBranchVersion(function(version){
			grunt.log.write(('当前分支：' + version).green);
			grunt.config.set('currentBranch', version);
			done();
		});

		// 构建和发布任务
		if (!type) {
			task.run(['build']);
		}
	});

};
