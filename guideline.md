## 淘北京Web前端开发基础设施建设

### 什么是Clam

![](http://img04.taobaocdn.com/tps/i4/T1C5hpXwXeXXbkQf6j-210-45.jpg)

Web 前端项目开发必然依赖一揽子辅助工具和约定，来保持代码的快速流转和可维护性。 

一套完整的前端技术基础设施包括六个方向：

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

#### 1. 业务的特点

摘自[《编写可维护的JavaScript》](http://jayli.github.com/maintainable.javascript/)：

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

### Clam 遵循的原则

`Clam`志在为前端工程师提供更简单和一致的项目开发体验。Clam 遵循这些易于理解的原则：

1. Server 服务随源码携带
1. Assets 的源码和目标代码同时发布，比如`a-min.js`一定存在其源码`a.js`。
1. CDN 代码非覆盖式发布，发布基于项目版本`x.y.z`，而非文件版本，比如线上代码为`0.1.2/a.js`而非`a-0.1.2.js`
1. 项目均包含描述文件`Gruntfile.js`，用于组织 Grunt 构建和定义本地 Server 服务
1. 共享代码通过`bower install {moduleName}`的形式安装和更新
1. 项目结构代码骨架统一：Pages+Mods+widgets

这些原则将直接指导我们应对快速的需求变更和代码流转，同时能遵循一致的规范和自然形成沉淀。

### Clam 模块化开发

#### 模块定义

`Clam` 非常激进的提供了从底层架构层面对于前端模块化开发的支持。先来了解一下`Clam`对于前端项目的理解。

传统上前端工作里“项目”的概念远没有后台软件开发领域里那么清晰，这主要是由于以往的客户端页面较简单，不需要太多“项目”层面的支持。随着现在客户端功能的越趋复杂，有必要系统的来引入一套针对前端业务特点构建的架构模式。

Clam里对于项目的定义是一个完整的前端应用，或其中一个相对独立的某一个业务场景。如：一个单页富应用，可以作为一个Clam项目；或者业务耦合度较高，用户使用路径很近的一组页面，也可以作为一个Clam项目。

对于一个Clam项目的具体页面，除了页面自身的html模板，样式和脚本外，它还可以引用一组模块，其中每个模块都有其独立的html模板，样式和脚本文件。同时页面上还可以存在一些通用的组件，如下图所示：

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
- Grunt-uglify、Grunt-cssmin、Grunt-replace、Grunt-less，Grunt-css_combo
- [Grunt-mytps](https://npmjs.org/package/grunt-mytps)，上传本地图片到tps服务器，依赖python（默认不开启，开发者自行配置）
- [Grunt-toascii](https://npmjs.org/package/grunt-toascii)，把文件中的非英文字符转码成对应的ascii码（默认不开启，开发者自行配置）
- [Grunt-cssimage](https://npmjs.org/package/grunt-cssimage)，对css文件中的图片进行压缩替换，支持远程图片抓取（默认不开启，开发者自行配置）

### 基于 NodeJS 的本地 Server

本地 Server 跟随代码安装和启动，以	Grunt 插件形式提供。

#### 本地服务原理

#### Demo 开发时的 Mock 数据模拟

本地服务支持[juicer模板](http://juicer.name)渲染输出，因此在源html中可以直接用juicer语法来写页面，比如源文件:

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

> 这个功能主要提供了调试的渠道，写demo时就直接生成了juicer模板，通过[grunt-combohtml](https://github.com/jayli/grunt-combohtml)可以将juicer语法的源文件编译为velocity语法和php语法。

#### Debug 线上 JS 和 CSS

#### 本地服务所依赖的 Grunt 插件