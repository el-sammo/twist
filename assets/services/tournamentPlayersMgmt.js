(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Tournament Players Management
	///

	app.factory('tournamentPlayersMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var tournamentPlayers;
		var getTournamentPlayersByTournamentPromise;

		var service = {
			getTournamentPlayers: function(tournamentId) {
				var url = '/tournamentplayers/byTournamentId/' + tournamentId;
				getTournamentPlayersByTournamentPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getTournamentPlayersByTournamentPromise;
			}
		};

		return service;
	}

}());
