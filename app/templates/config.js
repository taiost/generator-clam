(function(){
    KISSY.config('tag', null);

	var debug = false,
		publish,
		daily,
    	host = window.location.host;

	if(location.search.indexOf('ks-debug') >= 0){
		debug = true;
	}

	// 开发环境
    if (host.match(/dev\./ig)) {
        debug = true;
    }

	// 线上环境
    if ((host.match(/m.taobao.com/igm) || host.match(/m.trip.taobao.com/igm)) &&
        debug !== true) {
        publish = true;
    }

	// 日常 和 预发环境
    if ((host.match(/wapa.taobao.com/igm) || host.match(/waptest.taobao.com/igm)) &&
        debug !== true) {
        daily = true;
    }

	// 离线包
	if(!(window.location.protocol.match(/http:/) || 
			window.location.protocol.match(/https:/))){
		debug = true;
	}

	KISSY.Config.debug = debug;
	KISSY.Config.publish = publish;
	KISSY.Config.daily = daily;

	if (debug) {
		KISSY.config({
			combine:false,
			packages:[
				{
					name:"<%= packageName %>",
					path:"<%= srcPath %>",
					charset:"utf-8",
					ignorePackageNameInUri:true,
					debug:true
				}
			]
		});
	} else {
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
