(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Game Management
	///

	app.factory('gameMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var game;
		var getGamePromise;

		var service = {
			getGame: function(gameId) {
				var url = '/games/' + gameId;
				getGamePromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getGamePromise;
			},

			createGame: function(gameData) {
				var url = '/games/create';
				return $http.post(url, gameData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoGame(data, true);
						return game;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateGame: function(gameData) {
				var url = '/games/' + gameData.id;
				return $http.put(url, gameData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoGame(data, true);
						return game;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			// TODO: This probably can be replaced with client-side only code
			logout: function() {
				var url = '/games/logout';
				return $http.get(url).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoGame({}, true);
						// TODO - Clear session also
					}
				).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getSession: function() {
				var url = '/games/session';
				return $http.get(url).then(function(sessionRes) {
					if(! (sessionRes && sessionRes.data)) {
						return $q.reject(sessionRes);
					}
					return sessionRes.data;

				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					$q.reject(err);
				});
			},

			setWelcomed: function(sessionData) {
				sessionData.welcomed = true;
				var url = '/games/welcomed/' +sessionData.sid;
				return $http.put(url, sessionData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return data;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

			// TODO - Get game by username
			// :split services/signup.js

		};

		function mergeIntoGame(data, replace) {
			if(! game) {
				game = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(game, function(val, key) {
					delete game[key];
				});
			}

			angular.forEach(data, function(val, key) {
				game[key] = val;
			});
		};

		return service;
	}

}());
