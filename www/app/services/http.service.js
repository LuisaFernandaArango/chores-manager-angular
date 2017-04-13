(function(){

//Servicio utilizado para hacer solicitud a la base de datos
	angular.module('myApp')
	.service('httpService', ['$http', 'applicationConfig', httpService]);

	function httpService($http, applicationConfig){
		
		var service = {
			get: get,
			post:post,
			put:put,
			deleteReq, deleteReq
		};
		return service;

		function makeRequest(url, requestType, params, successCallback, errorCallback, headers) {

			var requestConfig = {
				method: requestType,
				url: applicationConfig.base_url + url,
				data: params,
				timeout: 10000
			};

			if (headers !== undefined) {
				requestConfig.headers = headers;
			}

			$http(requestConfig).then(successCallback, errorCallback);
		};

		function get(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'GET', params, successCallback, errorCallback, headers);
		}

		function post(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'POST', params, successCallback, errorCallback, headers);
		}

		function put(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'PUT', params, successCallback, errorCallback, headers);
		}

		function deleteReq(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'DELETE', params, successCallback, errorCallback, headers);
		}
	};
})();