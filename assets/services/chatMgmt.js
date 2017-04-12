(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Chat Management
	///

	app.factory('chatMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var chat;
		var getChatPromise;
		var createNewChatpromise;

		var service = {
			getChatByGameId: function(gameId) {
				var url = '/chats/byGameId/' + gameId;
				getChatPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getChatPromise;
			},

			createChat: function(chatData) {
				var url = '/chats/create';
				return $http.post(url, chatData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return chat;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}
		};

		return service;
	}

}());
