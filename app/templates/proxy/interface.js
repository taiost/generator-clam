/**
 * Created by <%= author %><<%= email %>>.
 * Proxy For Interface Mock
 */

/**
 * 接口 mock 处理模块
 * @param requestUrl {String} 请求 URL
 * @param requestData {Object} 请求参数对象
 * @param responseData {Object} 响应对象
 * @param lib {Object} 辅助类库
 * @returns {Object} 返回可 JSON 序列化的对象
 */
module.exports = function (requestUrl, requestData, responseData, lib) {

	var _ = lib._;              // rel: http://underscorejs.org/
	var mockjs = lib.mockjs;    // rel: http://mockjs.com/

	return responseData;
};