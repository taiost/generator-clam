/**
 * @fileoverview <%= projectName %> - <%= modName %>.
 * @author <%=author %><<%=email %>>.
 */
/**
 * KISSY.use('<%= packageName %>/<%= mojoName %>/index',function(S,<%= modName %>){
 *		new <%= modName %>();
 * });
 */
KISSY.add(function(S,Base) {

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
	
},{
	requires:['base']	
});
