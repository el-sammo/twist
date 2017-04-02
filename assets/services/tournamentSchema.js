(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('tournamentSchema', service);
	
	service.$inject = [ ];
	
	function service() {
		function nameTransform(tournament) {
			if(! tournament || ! tournament.name || tournament.name.length < 1) {
				return 'tournament-name';
			}
			return (tournament.name
				.replace(/[^a-zA-Z ]/g, '')
				.replace(/ /g, '-')
				.toLowerCase()
			);
		}

		var service = {
			defaults: {
				tournament: {
					name: '',
					maxEntries: '',
					variant: '',
					timeControl: '',
					tournyDate: '',
					registrationOpens: '',
					startTime: '',
					entryFee: '',
					houseFee: '',
					status: '',
					closed: '',
					finalStandings: []
				}
			},

			populateDefaults: function(tournament) {
				$.map(service.defaults.tournament, function(value, key) {
					if(tournament[key]) return;
					if(typeof value === 'object') {
						tournament[key] = angular.copy(value);
						return;
					}
					tournament[key] = value;
				});
				return tournament;
			}
		};

		return service;
	}

}());
