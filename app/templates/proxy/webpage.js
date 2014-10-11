/**
 * Created by <%=author %><<%=email %>>.
 * Proxy For Web Pages
 */

/**
 * 页面代理处理脚本
 * @param requestUrl {String} 请求 URL
 * @param requestData {Object} 请求参数对象
 * @param $ {jQuery}
 * @param lib {Object} 辅助类库
 * @param lib._         underscore.js -> http://underscorejs.org/
 * @param lib.mockjs    Mock.js -> http://mockjs.com/
 */
module.exports = function (requestUrl, requestData, $, lib) {

	var _ = lib._;              // rel: http://underscorejs.org/
	var mockjs = lib.mockjs;    // rel: http://mockjs.com/

	$('title').text('我的测试环境');

};