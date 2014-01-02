## 淘北京前端团队开发工具集

![](http://gtms01.alicdn.com/tps/i1/T1hlJGFwpXXXcSR17F-327-101.png)

### 什么是 Generator-Clam

Web 前端项目开发需要依赖一揽子辅助工具和约定，来保持代码的快速流转和可维护性。 

一套完整的前端技术基础设施包括六个方面：

1. 前端框架（Kissy）
1. 代码骨架（Clam）
1. 构建工具（Grunt）
1. 服务和环境（Grunt-flexcombo）
1. 模块规范和公共代码仓库（PI）
1. 项目的开源开发模式（Git）

Clam 就是让整个过程简化的脚手架工具，让前端工程师快速进入项目角色，而不必担心项目交接成本、和脏代码影响心情。宏观上看，Clam 从整体上降低了项目流转成本，前端同学的相互补位更加灵活，让前端同学将精力放在核心代码和产品体验提升上。

### 为什么开源这么重要！！！

#### 1. Web 前端技术的特点

表现层代码隶属Web技术栈最顶层，受需求变化影响最直接，大量改版项目也导致页面代码频繁重写。因此一个由零散的信息碎片拼装而成的页面，天然不成架构。这会导致：

1. 代码缺少规范、难以形成通用方案
1. 代码无法积累、人的成长受限
1. 代码无法流转、项目交接困难

因此，项目和关键功能碎片化之后更要开源（企业内部开源），让你的代码可以被“种”在大量的页面、角落中，并可以自己生长（被fork二次开发）。让代码单元以多种形态（服务、组件、模块）运行在线上。

> 我们不要拿Git当SVN在用，fork、merge、pull request 应该成为最常用的三个命令

#### 2. 业务的特点

![](http://gtms01.alicdn.com/tps/i1/T1jDVGFqNXXXbfVq.d-205-266.png)

以下结论摘自[《编写可维护的JavaScript》](http://jayli.github.com/maintainable.javascript/)：

1. 软件声明周期中80%的成本消耗在了维护上
1. 几乎所有的软件维护者都不是它的最初作者
1. 编码规范提高可读性，让工程师快速理解新的代码
1. 源码应当作为产品来一部分来发布，是完整可打包的。

>  很少有人会打开代码编辑器从零开始写代码，多数时间你面对的是写好的代码... 正如我在Yahoo常说的：“当你开始工作时，不是在给你自己写代码，而是为后来人写代码”
> 
> ——N.C.Zakas

不幸的是，我们在日常项目中痛苦的适应着这种局面，痛苦的对已有的线上脏代码打补丁，而这些线上代码几乎全无文档、无规范、无交接人。因此开源会：

1. 将重要的、通用的功能用版本管理工具收纳起来
1. 源码的结构、构建方式、约定，作为技术文档的一部分沉淀下来
1. 更方便、透明的代码合并，一定程度用代码描述功能需求
1. debug 源码代替直接 debug 线上代码

### 项目（Assets）前端代码发布流程

#### 基本流程

![](http://gtms01.alicdn.com/tps/i1/T1yhsgFeJXXXXi0pTP-614-379.png)

前端工程师拥有大部分的HTML的发布权限和所有的JS/CSS/IMG的发布权限。HTML片段参与组成线上页面。基于HTML和CSS/JS分离的原则，前端工程师会将更多的时间用户修补JS/CSS而非HTML。因此JS和CSS的重要性大于HTML。

#### CDN 的 Combo 服务

Combo是淘系CDN提供的基础服务，动态输出CDN里的颗粒文件。比如：

	http://g.tbcdn.cn/path/??a.js,b.js

将输出`a.js`和`b.js`两个文件

### Generator-Clam 遵循的原则

`Generator-Clam`我们简称`Clam`，`Clam`志在为前端工程师提供更简单和一致的项目开发体验。Clam 遵循这些易于理解的原则：

1. Server 服务随源码携带
1. Assets 的源码和目标代码同时发布，比如`a-min.js`一定存在其源码`a.js`。
1. CDN 代码非覆盖式发布，发布基于项目版本`x.y.z`，而非文件版本，比如线上代码为`0.1.2/a.js`而非`a-0.1.2.js`
1. 项目均包含描述文件`Gruntfile.js`，用于组织 Grunt 构建和定义本地 Server 服务
1. 共享代码通过`bower install {moduleName}`的形式安装和更新
1. 项目结构代码骨架统一：Pages+Mods+widgets

这些原则将直接指导我们应对快速的需求变更和代码流转，同时能遵循一致的规范和自然形成沉淀。

### Generator-Clam 模块化开发

#### 模块定义

`Generator-Clam` 非常激进的提供了从底层架构层面对于前端模块化开发的支持。先来了解一下`Generator-Clam`对于前端项目的理解。

传统上前端工作里“项目”的概念远没有后台软件开发领域里那么清晰，这主要是由于以往的客户端页面较简单，不需要太多“项目”层面的支持。随着现在客户端功能的越趋复杂，有必要系统的来引入一套针对前端业务特点构建的架构模式。

Clam 里对于项目的定义是一个完整的前端应用，或其中一个相对独立的某一个业务场景。如：一个单页富应用，可以作为一个 Clam 项目；或者业务耦合度较高，用户使用路径很近的一组页面，也可以作为一个 Clam 项目。

对于一个 Clam 项目的具体页面，除了页面自身的html模板，样式和脚本外，它还可以引用一组模块，其中每个模块都有其独立的html模板，样式和脚本文件。同时页面上还可以存在一些通用的组件，如下图所示：

![](http://gtms01.alicdn.com/tps/i1/T17QRDFuRdXXXQxFse-494-368.png)

1. 一个Clam项目由若干页面Page、模块Module、和组件Widget构成；
1. 其中Page和Module可以由html，css，js等组成；Widget对外提供的代码通常只有JS/CSS；
1. Page可以在其html里包含Module的html文件来使用模块；
1. Module通常是与业务关系较密切的独立功能块，比如一个订票网站的常用联系人模块；
1. Module应做到尽可能独立，最理想的情况是完全独立于页面；
1. Widget是与具体业务耦合较松，复用性更强的功能块，如日历组件；
1. Page的html部分通常是用来包含模块html或为组件提供容器的。

比如一个典型的Clam项目结构如下：

	.hello_pro
		├── build/
		├── Gruntfile.js
		└── src
		    ├── config.js
		    ├── mods
		    │   └── def
		    │       ├── demo.html
		    │       ├── index.css
		    │       ├── index.html
		    │       └── index.js
		    └── pages
		        └── abc
		            ├── index.css
		            ├── index.html
		            └── index.js

其中`src/pages/abc/index.html`内容：

	<!DOCTYPE HTML>
	<html>
	<head>
		<meta charset="utf-8" />
		<title> H5Test - Abc demo </title>
		<script src="http://g.tbcdn.cn/kissy/k/1.4.0/seed-min.js"></script>
		<link rel="stylesheet" href="index.css"/>
		<script src="../??config.js"></script>
	</head>
	<body>
		<!--#include virtual="../../mods/def/index.html" -->
		<script>
			KISSY.use('h5-test/abc/index', function(S, Abc) {
				new Abc();
			});	
		</script>
	</body>
	</html>

因为页面中需给JS传参，通过`new Abc({JSONData})`将数据传递给Abc模块，不要通过全局变量给JS传参。

`src/mods/def/index.html`内容为：

	<link href="../mods/def/index.css" rel="stylesheet" />
	模块正文
	<script>
		KISSY.use('h5-test/def/index', function(S, Def) {
			new Def();
		});	
	</script>


启动本地demo服务`grunt demo`，浏览器绑定HTTP服务`127.0.0.1:8080`，访问`demo.com/pages/abc/index.html`

	<!DOCTYPE HTML>
	<html>
	<head>
		<meta charset="utf-8" />
		<title> H5Test - Abc demo </title>
		<script src="http://g.tbcdn.cn/kissy/k/1.4.0/seed-min.js"></script>
		<link rel="stylesheet" href="index.css"/>
		<script src="../??config.js"></script>
	</head>
	<body>
		<link href="../mods/def/index.css" rel="stylesheet" />
		模块正文
		<script>
			KISSY.use('h5-test/def/index', function(S, Def) {
				new Def();
			});	
		</script>
		<script>
			KISSY.use('h5-test/abc/index', function(S, Abc) {
				new Abc();
			});	
		</script>
	</body>
	</html>

Clam 推荐将模块所有的外部依赖都在模块html文件内引入，这样可以做到模块的完全独立。同样的，你毋需担心引入诸如jQuery，CSS Reset等文件带来的麻烦。Clam会在项目build阶段做排重处理，确保你最终打包后的页面一个资源只引入一次。



#### 项目的构建

Clam 项目构建基于[Grunt](http://www.gruntjs.net/)，构建任务作为插件配置到`Gruntfile.js`中。这些任务包括：

- [Grunt-combohtml](https://npmjs.org/package/grunt-combohtml)
	- 合并SSI的html，抽取页面中分散的JS和CSS，合并好后输出；
	- 解析原html中的[juicer模板](http://juicer.name)，生成vm、tms或者php。
- [Grunt-kmc](https://github.com/daxingplay/grunt-kmc)，JS库代码依赖KISSY，使用KISSY打包工具来解析源码中JS的依赖关系，生成`map.js`或者静态合并。
- Grunt-uglify、Grunt-cssmin、Grunt-replace、Grunt-less，`Grunt-css_combo`
- [Grunt-mytps](https://npmjs.org/package/grunt-mytps)，上传本地图片到tps服务器，依赖python（默认不开启，开发者自行配置）
- [Grunt-toascii](https://npmjs.org/package/grunt-toascii)，把文件中的非英文字符转码成对应的ascii码（默认不开启，开发者自行配置）
- [Grunt-cssimage](https://npmjs.org/package/grunt-cssimage)，对css文件中的图片进行压缩替换，支持远程图片抓取（默认不开启，开发者自行配置）

### 基于 NodeJS 的本地 Server

本地 Server 跟随代码安装和启动，以	Grunt 插件形式提供。

#### 本地服务原理

![](http://gtms01.alicdn.com/tps/i1/T1TgNqFB0bXXbX25fJ-346-77.png)

[Grunt-flexcombo](https://github.com/jayli/grunt-flexcombo) 是一款基于NodeJS的轻服务，便携且易于配置。用于淘系环境中的Demo服务和自定义虚机等场景。

> [Grunt-flexcombo](https://github.com/jayli/grunt-flexcombo) 是 [flex-combo](https://npmjs.org/package/flex-combo) 的grunt插件版本，[Grunt-Flexcombo 原理介绍](https://speakerdeck.com/lijing00333/grunt-flexcombo)。

##### 本地服务的启动

基于Clam生成的项目目录运行`sudo grunt debug`，将会启用`flexcombo`服务，会在本地启动两个 Server 服务，两个服务分属两个端口`proxyport`（反向代理服务）和`port`（Flexcombo 模拟 CDN 环境）

- 反向代理服务：用于启用本地虚机
- [flexcombo](https://npmjs.org/package/flexcombo)服务：映射 CDN Combo 请求中的某个文件到本地：`http://cdn/??a.js,b.js`

![](http://gtms01.alicdn.com/tps/i1/T1.ey8FnleXXcxFyEb-523-342.png)

启动服务后，绑定设备，以下两种方法取其中一个，推荐第二种：

1. 将cdn配向本机`127.0.0.1 g.tbcdn.cn a.tbcdn.cn`
1. 将浏览器或者设备HTTP代理配置到本机的反向代理服务的端口

比如在手机终端设置代理方法：

![](http://gtms01.alicdn.com/tps/i1/T1bePRFlVXXXXhb4nD-502-341.png)

然后可以直接通过`g.tbcdn.cn`域名来预览本地文件

	http://g.tbcdn.cn/{group}/{project}

> flexcombo服务可以配合watch和你Gruntfile.js中的构建命令，完成代码调试，比如在[Gallery中的代码调试](http://gallery.kissyui.com/quickstart)，更多内容参照：[grunt-flexcombo 配置方法](https://npmjs.org/package/grunt-flexcombo)。

#### Flexcombo 服务启动后如何映射 Combo URL 里的文件

我们通过[一个案例](https://github.com/jayli/grunt-flexcombo/tree/master/test)来说明原理：

1，将示例代码检出

将仓库检出到任意目录：

	git clone https://github.com/jayli/grunt-flexcombo.git

2，补全`node_modules`

进入到刚检出的目录中：

	cd grunt-flexcombo/test
	npm install

3，启动本地服务

在`test`目录中执行

	sudo grunt demo

这时服务启动。

4，打开浏览器，绑定HTTP代理到本机

![](http://gtms01.alicdn.com/tps/i1/T1KzNFFrxbXXcrSyrN-372-175.png)

5，浏览器中访问这个URL

	http://g.tbcdn.cn/??test/index.js,kissy/k/1.4.0/seed.js

可以看到本地文件`test/index.js`和线上文件`kissy/k/1.4.0/seed.js`一并输出。这时，在命令行窗口可以看到请求log：

![](http://gtms01.alicdn.com/tps/i1/T1BnVEFqFcXXcRrscV-548-134.png)

#### Demo 开发时的 Mock 数据模拟

Grunt-Flexcombo 服务支持[juicer模板](http://juicer.name)渲染输出，因此在源html中可以直接用juicer语法来写页面，比如源文件:

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

即，数据和juicer模板混合输出了正确的结果。

如果源文件中存在Mock数据字段`<!--#def ... -->`，则服务将会解析文件中的juicer模板

> 这个功能主要提供了调试数据模板的方法，写demo时就直接生成了juicer模板，通过[grunt-combohtml](https://github.com/jayli/grunt-combohtml)可以将juicer语法的源文件编译为velocity语法和php语法。

#### 本地 Server 服务器对 PHP 文件的解析

项目代码中的`.php`的文件，会被本地 Server 正常解析，前提是你本机环境安装有php（在命令行执行`php -v`查看是否安装）。由于只是[模板语言的转换](http://php.net/manual/zh/features.commandline.php)，因此php中无法直接获取`外部变量`，比如`$_ENV`、`$_SESSION`等。若要获取`$_GET`参数，php 文件顶部添加：

	<?
	if(isset($argv)){
		$_GET = (array)(json_decode($argv[2]));
	}
	?>

之后就可以使用`$_GET`来获取URL参量了。

#### 本地服务所依赖的 Grunt 插件

- [flexcombo](https://npmjs.org/package/flex-combo) FlexCombo，本地服务器的核心
- [Grunt-flexcombo](https://npmjs.org/package/grunt-flexcombo)，flexcombo的grunt版本
- [jayli-server](https://npmjs.org/package/jayli-server)，Simple-SSI Server

### 把 Generator-Clam 运行起来 

终于到正题了，在看接下来的内容之前，你应当首先熟悉这些东东

![](http://gtms01.alicdn.com/tps/i1/T11RMcFg0cXXaO85U_-560-117.png)

1. [grunt](http://gruntjs.net/)
1. [yeoman](http://yeomanjs.org/)
1. [bower](http://bower.io/)
1. [kissy](http://docs.kissyui.com)
1. [grunt-kmc](https://github.com/daxingplay/grunt-kmc)

同时要理解基于[Gitlab的代码发布机制](http://velocity.alibaba-inc.com/projects/f2e-tools/wiki/Assets_Publish)

环境依赖：Node、Npm， 使用 Generator-Clam 创建项目骨架的视频演示：[http://ascii.io/a/4384](http://ascii.io/a/4384)。[Generator-Clam 的介绍 PPT](https://speakerdeck.com/lijing00333/generator-clam2)。

#### Generator-Clam 的安装

首先安装 [grunt](http://gruntjs.com) 和 [yeoman](http://yeoman.io/)：

	npm install -g yo grunt-cli

安装 Generator-Clam：

	npm install -g generator-clam generator-kissy-gallery

安装完成后，命令行新增这些命令：

- `yo clam:h`: 打印工具帮助信息
- `yo clam`: 初始化一个标准的Project
- `yo clam:mod`: 初始化一个模块
- `yo clam:page`: 初始化一个Page
- `yo clam:pi`: 初始化一个[Pi](http://pi.taobao.net) 组件
- `yo clam:widget`: 初始化一个标准[kissy组件](http://gallery.kissyui.com)，首先创建组件空目录，进入空目录后执行此命令
- `yo clam:widget x.y`: 生成一个标准kissy组件的版本，进入到组件目录后执行。其中x.y是版本号

#### Bower 内嵌命令

首先安装 Bower

	sudo npm install -g bower

安装组件代码的最新包，比如安装`tpi/button`

	bower install tpi/button

使用老的包

	bower install tpi/button#publish/0.1.0

如果主干包的代码有更新，更新包

	bower update tpi/button

#### Grunt 内嵌命令

初始化完成的项目包含`Gruntfile.js`模板，可以辅助你完成：

- `grunt`: 执行构建
- `grunt prepub`:执行预发
- `grunt publish`:执行发布
- `grunt info`:查看当前库git地址
- `grunt newbranch`:创建新daily分支，基于当前版本累加
- `grunt watch`:监听文件修改，实时编译
- `grunt demo`:开启本地Demo调试模式
- `grunt debug`:开启生产环境Debug模式
- `grunt combohtml`:构建包含SSI的html，合并页面中的css和js，编译juicer模板为VM、php和TMS格式
- `grunt build`:默认构建流程

使用`yo clam`构建好项目后，会在项目根目录下生成`Gruntfile.js`。

`Gruntfile.js`使用到的一些基本参数存放在`abc.json`中，生成好的`abc.json`格式如下：

	{
		"name": "项目名称",
		"desc": "项目描述",
		"type": "clam",
		"port":"80",
		"group":"Group名称",
		"src":"false",
		"combohtml":"true",
		"version":"0.0.1",
		"author": {
			"name": "",
			"email": ""
		},
		"repository": {
			"type": "git",
			"url": "http://gitlab.alibaba-inc.com/trip/h5-test"
		}
	}

生成一个新的daily分支（`grunt newbranch`）时会自动更新`abc.json`的`version`字段。

> 注意: grunt 构建任务可选`grunt-mytps`子任务，该子任务（上传本地图片到CDN并替换地址）依赖python，并需要安装[tpsmate](https://github.com/sodabiscuit/tpsmate)。该任务默认不开启。

#### Clam 格式的项目中启动 Demo 服务

执行`grunt demo`，启动`src`目录的调试

![](http://gtms01.alicdn.com/tps/i1/T1xlFEFzxgXXaOmlQV-444-280.png)

访问 demo 时应当带上`?ks-debug`，上线后的项目引用`config.js`的绝对地址即可。

#### 基于项目代码，模拟线上 CDN 环境

如果你的项目用 clam 工具生成，且已经上线了，如何 debug 其中一个源 JS？

Step 1，将项目git源码checkout到本地（比如目录`path/to/local_pro/`）

Step 2，开启Debug模式

	sudo grunt debug 

这时开启了本地服务，并将目录映射到了`build/`下，同时开启了对`src/`中文件修改的监听

Step 3， 客户端环境映射，二选一

1. 配host：`127.0.0.1 g.tbcdn.cn`
1. 配proxy：[参照这里](https://npmjs.org/package/grunt-flexcombo)

Step 4，给浏览器绑定HTTP代理（IP:8080）后，在`'src'`目录中给你的js加断点，保存即可

#### Assets 的预发和发布

默认情况下，非 daily 分支上禁止构建（不建议将此限制去掉），只有 build 目录中的文件会被发布，发布后会在项目目录后带上版本号，可以通过`a.tbcdn.cn`和`g.tbcdn.cn`两种域名访问，对应关系为：

	http://a.tbcdn.cn/g/group-name/project-name/x.y.z/mods.js

对应到 g.tbcdn.cn 的地址：

	http://g.tbcdn.cn/group-name/project-name/x.y.z/mods.js

代码发布命令：

- `grunt prepub` 预发
- `grunt publish` 发布

#### 创建 PI 格式的组件

[What is PI?](http://pi.taobao.net/)

PI 格式的组件结构和[KISSY Gallery](http://gallery.kissyui.com/guide)完全一样，只是没了版本号

创建PI格式的组件：先创建目录，并进入到这个目录，执行
	
	yo clam:pi

#### Clam 格式项目代码案例

1. 解析JS依赖并生成Map：[Project](http://gitlab.alibaba-inc.com/trip/h5-test/tree/publish/0.1.29)
1. 基于JS依赖静态构建：[Project](http://gitlab.alibaba-inc.com/trip/h5-test/tree/publish/0.1.28)

### 再多了解一点Generator-Clam

[淘北京前端开发环境/工具建设里程碑](http://work.taobao.net/issues/3830)

2013年淘系全面推广基于Gitlab的Assets发布，Generator-Clam 延续了 [Clam](http://gitlab.alibaba-inc.com/clam) 模块化的思想，结合 Yeoman 和 Grunt 提供了面向淘系前端环境构建脚手架工具，包含前端开发/构建/发布的全流程。

### Q & A

1，'yo clam'安装node模块的时候报错？

	npm ERR! Error: EACCES, mkdir '/usr/local/lib/node_modules/grunt-xx'

- 原因：没有sudo
- 解决办法：在当前目录执行`sudo npm install`

2，tpsmate安装完了还是不能把图片自动上传CDN?

- 原因：需要首先找到`node_modules`中手动执行一次
- 解决办法：进入`node_modules/grunt-mytps/tasks/lib/tpsmate/src`，执行`python ./cli.py upload`，这时提示你输入TMS用户名和密码，完成即可

详细文档参照：<https://github.com/sodabiscuit/tpsmate>

3，tpsmate安装完成，但执行报错？

- 原因：依赖包不完整
- 解决办法：安装tpsmate的依赖

	pip install -r node_modules/grunt-mytps/tasks/lib/tpsmate/src/requirements.txt

4，yo clam 构建好目录结构后安装npm包时间太长，怎么办？

- 原因：构建项目最后使用`npm install`安装npm包
- 解决办法：在首次构建项目的时候最后一步询问是否安装本地`node_modules`，输入`N`，在当前目录使用`npm install --link`，将包安装到全局。以后每次`yo clam`最后都不安装本地包，使用`npm install --link`来安装，速度会很快。

5，yo clam:mod 构建好一个模块后，怎么运行它？

直接访问生成好的html文件，`xx/index.html?ks-debug`，会有弹框"ok"。

6，生成的默认Gruntfile.js只根据入口文件合并JS，我如何生成依赖关系表mods.js ？

修改Gruntfile.js，参照注释修改kmc任务即可。

7，`grunt server`启动报错`Error: listen EACCES`

在Mac/Linux下需要root权限才能启用80端口，加上sudo
	
	sudo grunt server

8，`grunt server`提示Error: listen EADDRINUSE。

Flex Combo所需要使用的端口正在被使用中，如果这个端口是80端口，你需要检查系统中是否有其他web容器，比如Apache、Nginx等是否使用了80端口。如果不是，你需要检查是否系统中有其他FlexCombo正在运行。

9，运行`grunt server`时报错：“Error: EMFILE, too many open files”

运行：

	ulimit -n 10000

10，grunt server后，访问我的文件报错：`Fatal error: Cannot read property 'host' of undefined`

是因为你访问的JS或CSS文件在本地不存在，且在线上也不存在，保证本地文件存在即可

默认情况下，你需要保证访问地址的host是g.tbcdn.cn或a.tbcdn.cn，如果使用别的域名，需要在`~/.flex-combo/config.json`中修改配置项：

	hosts:{
		'a.tbcdn.cn':'122.255.67.241',
		'g.tbcdn.cn':'155.238.23.250',
		'your.host.name':'155.238.23.250'//ip地址配置到对应的cdn地址
	}

11，SSI 不起作用？

看你是不是格式写的不对？`<!--#include virtual="path.html" -->`，`#`之前不要有空格

12，在windows下开启服务后，访问`http://localhost`或者`http://127.0.0.1`报错？

需要直接访问你的项目所在的目录`http://g.tbcdn.cn/group/pro/`，或者配置`proxyHosts`，使用虚机域名来访问

13，我不想让flexcombo占用80端口，可否实现？

可以，配置`abc.json`中的`port`字段即可，如果不是80端口，无法绑定host，只能绑定HTTP代理到8080端口来调试。


### TODO

- JSON接口模拟和映射
- juicer 模板的各种平台的转换
- Html5 项目模板添加

