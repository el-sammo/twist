(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('tournamentPlayersSchema', service);
	
	service.$inject = [ ];
	
	function service() {
		var service = {
			defaults: {
				tournamentPlayers: {
					tournamentId: '',
					playerId: ''
				}
			},

			populateDefaults: function(tournamentPlayers) {
				$.map(service.defaults.tournamentPlayers, function(value, key) {
					if(tournamentPlayers[key]) return;
					if(typeof value === 'object') {
						tournamentPlayers[key] = angular.copy(value);
						return;
					}
					tournamentPlayers[key] = value;
				});
				return tournamentPlayers;
			}
		};

		return service;
	}

}());
