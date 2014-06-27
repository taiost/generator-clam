(function(){
    KISSY.config('tag', null);

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
                    path: 'http://' + srcHost +'/<%= groupName %>/<%= packageName %>/@@version',
                    ignorePackageNameInUri: true
                }
            ]
        });
	}
})();
