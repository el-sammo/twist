(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Trd Management
	///

	app.factory('trdMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var trd;
		var getTrdsByDatePromise;
		var closeRacePromise;
		var unCloseRacePromise;
		var scratchEntryPromise;
		var unScratchEntryPromise;
		var favoriteEntryPromise;
		var unFavoriteEntryPromise;

		var service = {
			getTrd: function(trdId) {
				var url = '/trds/' + trdId;
				return $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getTrdsByDate: function(date) {
				var url = '/trds/byDate/' + date;
				getTrdsByDatePromise = $http.get(url).then(function(res) {
					mergeIntoTrd(res.data);
					return trd;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getTrdsByDatePromise;
			},

			createTrd: function(trdData) {
				var url = '/trds/create';
				return $http.post(url, trdData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoTrd(data, true);
						return trd;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateTrd: function(trdData) {
				var url = '/trds/' + trdData.id;
				return $http.put(url, trdData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoTrd(data, true);
						return trd;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			closeRace: function(trdId, raceNum, customerId) {
				var url = '/trds/closeRace/' + trdId +'-' + raceNum +'-'+ customerId;
				closeRacePromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return closeRacePromise;
			},

			unCloseRace: function(trdId, raceNum, customerId) {
				var url = '/trds/unCloseRace/' + trdId +'-' + raceNum +'-'+ customerId;
				unCloseRacePromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return unCloseRacePromise;
			},

			scratchEntry: function(trdId, raceNum, entryNum, customerId) {
				var url = '/trds/scratchEntry/' + trdId +'-'+ raceNum +'-'+ entryNum +'-'+ customerId;
				scratchEntryPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return scratchEntryPromise;
			},

			unScratchEntry: function(trdId, raceNum, entryNum, customerId) {
				var url = '/trds/unScratchEntry/' + trdId +'-'+ raceNum +'-'+ entryNum +'-'+ customerId;
				unScratchEntryPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return unScratchEntryPromise;
			},

			favoriteEntry: function(trdId, raceNum, entryNum, customerId) {
				var url = '/trds/favoriteEntry/' + trdId +'-'+ raceNum +'-'+ entryNum +'-'+ customerId;
				favoriteEntryPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return favoriteEntryPromise;
			},

			unFavoriteEntry: function(trdId, raceNum, entryNum, customerId) {
				var url = '/trds/unFavoriteEntry/' + trdId +'-'+ raceNum +'-'+ entryNum +'-'+ customerId;
				unFavoriteEntryPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('get ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return unFavoriteEntryPromise;
			},

			scoreTrd: function(scoreData) {
				var url = '/trds/score/' + scoreData.trdData.id;
				return $http.put(url, scoreData).success(
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
			},

			// TODO: This probably can be replaced with client-side only code
			logout: function() {
				var url = '/trds/logout';
				return $http.get(url).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoTrd({}, true);
						// TODO - Clear session also
					}
				).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getSession: function() {
				var url = '/trds/session';
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
				var url = '/trds/welcomed/' +sessionData.sid;
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

			// TODO - Get trd by username
			// :split services/signup.js

		};

		function mergeIntoTrd(data, replace) {
			if(! trd) {
				trd = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(trd, function(val, key) {
					delete trd[key];
				});
			}

			angular.forEach(data, function(val, key) {
				trd[key] = val;
			});
		};

		return service;
	}

}());
