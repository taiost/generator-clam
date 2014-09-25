/**
 * @module <%= comConfig.name %>
 **/
KISSY.add(function(S,Base) {

    /**
     * @class <%= comConfig.componentClass %>
     * @constructor
     * @extends Base
     */
    var <%= comConfig.componentClass %> = Base.extend({
        initializer:function(){
            var self = this;
            this.renderUI();
            this.bindUI();
        },
        renderUI : function(){

        },
        bindUI : function(){

        },
        //析构
        destructor : function(){

        }
    },{
        ATTRS: {
            // 这里是初始参数和默认值
            node : {
                value:null,
                setter : function(val){
                    return S.one(val);
                }
            }
        }
    });

    return <%= comConfig.componentClass %>;
    
},{
    requires:['base']
});
