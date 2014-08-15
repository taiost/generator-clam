## Clam - 航旅前端基础工具集

![](http://gtms01.alicdn.com/tps/i1/TB1dzrbFVXXXXX_aXXXYVzw3FXX-222-310.png)

[背景知识](https://github.com/jayli/generator-clam/blob/master/userguide.md)

### 工具安装

安装TNPM

	npm install tnpm@1.0.4 -g --registry=http://registry.npm.alibaba-inc.com

安装clam

	tnpm install -g generator-clam grunt-cli yo bower generator-kpm awpp

配置[AWP](http://h5.taobao.org/admin/index.htm)平台的用户名和token

	awpp config

根据提示输入用户名（花名）和token

![](http://gtms03.alicdn.com/tps/i3/TB1tH16FVXXXXb5XVXX1hDC0FXX-630-82.png)

获取帮助（**重要**）

	yo clam:h

Done!

### 初始化一个 H5 项目架子

> 由于assets发布依赖git，html发布依赖awp，请务必保证拥有两者的权限

在gitlab中新建项目(比如`h5-test`)，并在本地checkout出目录，进入到`h5-test`目录中，执行

	yo clam

根据提示完成初始化任务:

![](http://gtms04.alicdn.com/tps/i4/TB1pjHcFVXXXXXcaXXXnna_QpXX-374-414.png)

初始化完成后默认没有安装`node_modules`，需要手动执行命令补全npm包，立即执行

	tnpm install

H5项目架子初始化完成（注意：这时只有结构，没有页面）,目录结构如下：

	.h5-test
		├── build/
		├── docs/
		├── Gruntfile.js
		└── src/
		    ├── config.js
		    ├── map.js
		    ├── widgets/ 
		    ├── mods/
		    │   └── def
		    │       ├── demo.html
		    │       ├── index.css
		    │       ├── index.html
		    │       └── index.js
		    └── pages/
		        └── abc/
		            ├── img/
		            ├── index.scss
		            ├── index.html
		            ├── mock.tms.html
		            └── index.js

其中`widgets`存放组件，`pages`存放页面，`mods`存放抽象出来的业务模块

> H5项目以工程为单位，而非页面为单位，比如机票H5用工程`h5-flight`表示

### 新建页面

进入到`src/pages`

	cd src/pages

新建H5页面

	yo clam:h5

根据提示完成

> 新建PC的页面使用`yo clam:page`命令

### H5 项目的本地包和离线包构建

在`h5-test`中执行

	grunt build

自动进行构建操作，如果是在gitlab的`daily/x.y.z`的分支上，则可以直接执行

	grunt

如果在创建项目的时候设定是H5项目，则`grunt`会自动构建离线包，会生成目录`build_offline`和`build_offline.zip`

### Assets 的预发和上线

一个完整的项目包含两部分内容，资源文件和HTML文件。资源文件（CSS、JS）使用gitlab来推送发布，html使用awp平台来推送发布。这两类推送和发布实质上是通过`git`（若干）命令和`awpp`命令完成的，clam 所携带的 grunt 只对 git 命令做了封装。

首先，gitlab的发布必须基于`daily/x.y.z`的分支，首先我们新建新的分支，如果新建或升级小版本（x.y.z中的z）则可以使用命令

	grunt newbranch

**预发操作**

发布之前必须先构建

	grunt

构建会生成`build`目录，`build`目录里的资源文件都会被发布，再执行

	grunt prepub

这时会将当前分支代码push到线上仓库，这会自动触发预发，命令行提示中会给出预发地址

**上线操作**

在分支里执行

	grunt publish

这时会基于当前代码分支生成名为`publish/x.y.z`的tag，并推送到线上，这会自动触发发布操作，发布操作会将远程`daily/x.y.z`分支删除，并将代码合并到`master`，发布完成后命令行提示会给出线上地址

### H5 项目中的 HTML 的预发和上线

执行`grunt`后生成的build目录里包含构建完成的js、css和html文件，如果当前的这个工程是一个H5工程（`abc.json`中的isH5是否为true），则可以通过awpp命令来发布`build/pages`里的html

在gitlab仓库的根目录下执行

	awpp

在提示下选择发布类型和文件：

![](http://gtms04.alicdn.com/tps/i4/TB1AqXJFVXXXXavaXXXkocIWVXX-418-264.png)

> 如果选择日常或者预发，需要注意，html里对线上资源文件的引用`http://g.tbcdn.cn`都应当修改成对预发资源的引用`http://g.assets.daily.taobao.net`，在执行awpp走预发流程之前，先执行`grunt daily`。

### 开发模式、调试模式、离线模式服务的启动

Clam 工具提供一套本地调试环境，这套环境跟随代码一同携带，共有三个环境

1. Demo 开发、调试 环境启动

	grunt demo

2. Debug 开发、调试 环境启动

	grunt debug

3. 离线包 预览 环境启动

	grunt offline

![](http://gtms02.alicdn.com/tps/i2/TB1whllFVXXXXa0aXXXs5LXGFXX-456-432.png)

三种模式都必须由浏览器、或者手机设备绑定IP:8080端口的代理，然后访问`demo.com`或者命令行提示中给出的几个域名，比如在手机端设代理的方法：

![](http://gtms01.alicdn.com/tps/i1/T1bePRFlVXXXXhb4nD-502-341.png)

如果是调试线上页面，则需要开启`grunt debug`模式，然后修改`src`里的js文件，打断点后会立即被构建到`build`，刷新线上文件即可所见即所得的debug

**线上URL映射到本地文件**

在Gruntfile.js中给flexcombo配置项增加了filter配置，比如

	proxyHosts:['demo','demo.com','h5.m.taobao.com'],
	filter:{
		'-min\\.js':'.js',
		// 访问 h5.m.taobao.com/trip/h5-trains/search/index.html
		// 将重定向到 ./build/pages/search/index.html
		// Example: '(.+)/trip/h5-train/\(.+\\.\)html':'$1/pages/$2html'
		'(.+)/trip/[^\/]+/\(.+\\.\)html':'$1/pages/$2html'
	}

执行`grunt debug`后，访问`h5.m.taobao.com`下的文件，都将转发请求到本项目文件，比如我访问

	http://h5.m.taobao.com/trip/h5-trains/search/index.html

将实际访问我本机的这个文件

	./build/pages/search/index.html

其中h5-trains是项目名称。如果想针对某个项目（比如`h5-car`）进行转发，可以这样

	filter:{
		'(.+)/trip/h5-car/\(.+\\.\)html':'$1/pages/$2html'
	}

如果想根据我们的[命名替换规则](http://work.taobao.net/issues/11968)，来做映射，可以这样写

	filter:{
		'(.+)/trip/car/\(.+\\.\)html':'$1/pages/$2html'
	}


filter中的key是一个字符串形式的正则表达式，value是被替换的字符串


### Juicer Mock 写法

> Clam的本地服务是基于[flex-combo](https://www.npmjs.org/package/grunt-flexcombo)来实现的，flexcombo支持Juicer Mock的语法来写带有数据的模板

在生成的H5页面或者PC页面目录中，都会带有一个`mock.tms.html`。这里的内容是典型的数据加模板的形式，模板语法遵循[Juicer](http://juicer.name/)。类似这样：

	<html>
	<body>
		<!-- 定义Mock数据 -->
		<!--#def
			{"list": [
					{"name":" guokai", "show": true},
					{"name":" benben", "show": false},
					{"name":" dierbaby", "show": true}
				]}
		-->
		<ul>
			{@each list as it,index}
				<li>${it.name} (index: ${index})</li>
			{@/each}
		</ul>
	</body>
	</html>

开启服务后浏览器中访问它，将输出：

	<html>
		<body>
			<!-- 定义Mock数据 -->
			<!--#def {"list": [ {"name":" guokai", "show": true}, 
			{"name":" benben","show": false}, 
			{"name":" dierbaby", "show": true} ]} -->
			<ul>
				<li>guokai (index: 0)</li>
				<li>benben (index: 1)</li>
				<li>dierbaby (index: 2)</li>
			</ul>
		</body>
	</html>

即，数据和juicer模板混合输出了正确的结果。如果源文件中存在Mock数据字段`<!--#def ... -->`，则服务将会解析文件中的juicer模板

### Clam 项目中的HTML文件引用

本地服务支持标准SSI（[Server Side Include](http://man.chinaunix.net/newsoft/ApacheManual/howto/ssi.html)）。

	<!--#include path="../src/file-path.html" -->

引用线上文件可以直接写线上地址即可

	<!--#include virtual="http://www.taobao.com" -->

### TMS 标签的引用

根据AWP规范，HTML页面中可以通过这种标示来引用外部静态文件

	<!--HTTP:http://www.taobao.com/go/tms/dump.php,utf8:HTTP-->

AWP平台和Clam自带的本地服务都支持这种解析

> 需要注意的是，H5 项目的离线包的构建，会将这种格式的引用做过滤，[详情阅读这里](http://gitlab.alibaba-inc.com/mpi/tms-offline-parser/tree/master)

### 本地服务映射HTML片段

本地服务的 debug 模式可以映射线上页面中的html片段到本地，配置方法见[html-proxy](http://cnpmjs.org/package/html-proxy)

通过项目配置文件`abc.json`来配置，类似

	"htmlProxy": [{
		"urlReg": "^http://trip.taobao.com/index$",
		"demoPage": "http://trip.taobao.com/index.php",
		"replacements": [{
			"fragment": "mods/demo/index.html",
			"selector": "#lg"
		}, {
			"fragment": "mods/nav/index.html",
			"selector": "#nv"
		}]
	}],

例子：http://gitlab.alibaba-inc.com/trip/trip-home-slide

检出代码，依次执行：

	git clone git@gitlab.alibaba-inc.com:trip/trip-home-slide.git
	cd trip-home-slide
	tnpm install
	grunt debug

打开浏览器，绑定本机的8080端口，访问`http://trip.taobao.com/index.php`，看到首焦图片被替换了。done

> 这种模式非常有用，特别对于跨团队协作、高模块化的项目中尤其有用，比如在淘宝首页便民中心，便民中心的代码就可以被拆出来，以一个HTML片段（非整个项目）作为一个独立的项目，Clam 工具的这个特性将提供非常方便的调试入口

### 组件安装

如果要使用现成的组件，可以通过`bower`命令来安装，比如要使用[calendar](http://gitlab.alibaba-inc.com/mpi/calendar)组件，则需要在`src/widgets`目录中执行：

	bower install mpi/calendar

即可

### 重要资料

每个项目的配置信息存放在`abc.json`中，组件代码仓库存放在[pi](http://pi.taobao.net)中。组件源码在（[mpi](http://gitlab.alibaba-inc.com/groups/mpi)和[tpi](http://gitlab.alibaba-inc.com/groups/tpi)中）。

感谢这些开源项目

![](http://gtms01.alicdn.com/tps/i1/T11RMcFg0cXXaO85U_-560-117.png)

![](http://gtms01.alicdn.com/tps/i1/T1TgNqFB0bXXbX25fJ-346-77.png)

![](http://gtms03.alicdn.com/tps/i3/T1230QFvtXXXby4FLC-257-123.png)

![](http://gtms03.alicdn.com/tps/i3/T19QhNFrlfXXbdiM7D-219-108.png)

1. [grunt](http://gruntjs.net/)
1. [yeoman](http://yeomanjs.org/)
1. [bower](http://bower.io/)
1. [kissy](http://docs.kissyui.com)
1. [grunt-kmc](https://github.com/daxingplay/grunt-kmc)
1. [Juicer](http://juicer.name)
1. [Less](http://www.lesscss.net/article/home.html) 和 [Sass](http://www.sass-lang.com/)
1. [grunt-flexcombo](https://github.com/jayli/grunt-flexcombo)

### Q & A

[参照这里](https://github.com/jayli/generator-clam/blob/master/userguide.md#q--a)

### 更新记录

1. 0.1.x
	1. 脚手架基础功能，代码片段整理
	1. 完善flex-combo，gruntfile.js
	1. 完善grunt demo 和grunt debug调试模式
	1. 完成文档0.1版本，并确定工具的范围和中远期规划
1. 0.2.x
	1. H5 项目和PC项目独立区分
	1. H5项目的在线包和离线包的区分和分别打包
	1. AWPP 工具从clam剥离出来，形成独立的规范
	1. 和Gitlab、AWP 平台的更贴切的整合
	
