(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Action Management
	///

	app.factory('actionMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var action;
		var getActionPromise;
		var createNewActionpromise;

		var service = {
			getActionsByGameId: function(gameId) {
				var url = '/actions/byGameId/' + gameId;
				getActionPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getActionPromise;
			},

			updateAction: function(actionData) {
				var url = '/actions/' + actionData.id;
				return $http.put(url, actionData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return action;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			createAction: function(actionData) {
				var url = '/actions/create';
				return $http.post(url, actionData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return action;
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
