(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Wager Management
	///

	app.factory('wagerMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var wager;
		var getWagerPromise;
		var getWagersByCustomerIdPromise;
		var getCustomerWagersByTournamentIdPromise;
		var getWagersByCustomerIdSinceMillisecondsPromise;
		var getLiveWagersByCustomerIdPromise;
		var closeWagersPromise;
		var unCloseWagersPromise;
		var cancelWagerPromise;

		var service = {
			getWager: function(wagerId) {
				var url = '/wagers/' + wagerId;
				getWagerPromise = $http.get(url).then(function(res) {
					return wager;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getWagerPromise;
			},

			getWagersByCustomerId: function(customerId) {
				var url = '/wagers/byCustomerId/' + customerId;
				getWagersByCustomerIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getWagersByCustomerIdPromise;
			},

			getCustomerWagersByTournamentId: function(tournyCustomerId) {
				var url = '/wagers/byTournyCustomerId/' + tournyCustomerId;
				getCustomerWagersByTournamentIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getCustomerWagersByTournamentIdPromise;
			},

			getWagersByCustomerIdSinceMilliseconds: function(params) {
				var url = '/wagers/byCustomerIdSinceMilliseconds/' + params;
				getWagersByCustomerIdSinceMillisecondsPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getWagersByCustomerIdSinceMillisecondsPromise;
			},

			getLiveWagersByCustomerId: function(customerId) {
				var url = '/wagers/byCustomerIdLive/' + customerId;
				getLiveWagersByCustomerIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getLiveWagersByCustomerIdPromise;
			},

			submitWager: function(wagerData) {
				var url = '/wagers/submitWager';
				return $http.post(url, wagerData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return data;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			closeWagers: function(trackRaceId) {
				var url = '/wagers/closeWagers/' + trackRaceId;
				closeWagersPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return closeWagersPromise;
			},

			unCloseWagers: function(trackRaceId) {
				var url = '/wagers/unCloseWagers/' + trackRaceId;
				unCloseWagersPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return unCloseWagersPromise;
			},

			cancelWager: function(wagerId) {
				var url = '/wagers/cancelWager/' + wagerId;
				cancelWagerPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return cancelWagerPromise;
			}

			// TODO - Get wager by username
			// :split services/signup.js

		};

		return service;
	}

}());
