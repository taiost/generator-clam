
/*
 * http://g.tbcdn.cn/<%= groupName %>/<%= packageName %>/<%= version %>/config.js
 */
(function(){
	if (KISSY.Config.debug) {
		var srcPath = "<%= srcPath %>";
		KISSY.config({
			packages:[
				{
					name:"<%= packageName %>",
					path:srcPath,
					charset:"utf-8",
					ignorePackageNameInUri:true,
					debug:true
				}
			]
		});
	} else {
		KISSY.config({
			packages: [
				{
					name: '<%= packageName %>',
					// 修改 abc.json 中的 version 字段来生成版本号
					path: 'http://g.tbcdn.cn/<%= groupName %>/<%= packageName %>/<%= version %>',
					ignorePackageNameInUri: true
				}
			]
		});
	}
})();
