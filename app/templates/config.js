/**
 * http://g.tbcdn.cn/<%= groupName %>/<%= packageName %>/@@version/config.js
 */
(function(){
    KISSY.config('tag', null); //去除?t时间戳

	var debug = (location.search.indexOf('ks-debug') >= 0);
	if (debug) {
		var srcPath = "<%= srcPath %>";
		KISSY.config({
			combine:false,
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
		if (location.host.match(/(waptest\.taobao|wapa.taobao|daily.taobao.net)/)) {
			KISSY.Config.daily = true;
		}
		var srcHost = KISSY.Config.daily ? 
				'g.assets.daily.taobao.net' :
				'g.tbcdn.cn';
        KISSY.config({
			combine:true,
            packages: [
                {
                    name: '<%= packageName %>',
                    // 修改 abc.json 中的 version 字段来生成版本号
                    path: 'http://' + srcHost +'/<%= groupName %>/<%= packageName %>/@@version',
                    ignorePackageNameInUri: true
                }
            ]
        });
	}
})();
