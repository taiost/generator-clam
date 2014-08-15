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
	var Base = require('base');
    var $ = Node.all;

	var <%= modName %> = Base.extend({
		initializer:function(){
			var self = this;

			// Your Code
			alert('ok');
		}
	},{
		ATTRS: {
			A:{
				value:'abc'
			}
		}
	});

	return <%= modName %>;
	
});
