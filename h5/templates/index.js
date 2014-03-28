/**
 * @fileoverview <%= projectName %> - <%= modName %>.
 * @author 
 */
/**
 * KISSY.use('<%= packageName %>/<%= mojoName %>/index',function(S,<%= modName %>){
 *		new <%= modName %>();
 * });
 */
KISSY.add(function (S, require) {

	"use strict";
	
	var Node = require('node');
    var $ = Node.all,
        EventTarget = S.Event.Target;

	var ATTR = {
		/*初始化参数*/
		v1:1,
		v2:2
	};
    /**
     * @class  <%= modName %>
     * @constructor
     */
    function <%= modName %>(attr) {
		this.init.apply(this,arguments);
    }

    S.augment(<%= modName %>, EventTarget, /** @lends Test.prototype*/{
		init:function(attr){
			this.buildParam(attr);
			alert('ok');
			return this;
		},
		buildParam:function(o){
			/* 属性直接挂在 self 上 */
			var self = this;
			if(o === undefined  || o === null){
				o = {};
			}
			function setParam(def, key){
				var v = o[key];
				self[key] = (v === undefined || v === null) ? def : v;
			}
			S.each(ATTR, setParam);
			return this;
		}
    });

    return <%= modName %>;

});
