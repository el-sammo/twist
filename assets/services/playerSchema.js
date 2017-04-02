(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('playerSchema', service);
	
	service.$inject = [ ];
	
	function service() {
		function nameTransform(player) {
			if(! player || ! player.fName || player.fName.length < 1) {
				return 'player-name';
			}
			return (player.fName
				.replace(/[^a-zA-Z ]/g, '')
				.replace(/ /g, '-')
				.toLowerCase()
			);
		}

		var service = {
			defaults: {
				player: {
					fName: '',
					lName: '',
					email: '',
					phone: '',
					addressNumber: '',
					addressApt: '',
					addressStreet: '',
					addressCity: '',
					addressState: '',
					addressZip: '',
					uscf: '',
					uscfExpiry: '',
					uscfRating: '',
					fide: '',
					fideExpiry: '',
					fideRating: '',
					ccomUsername: '',
					username: '',
					password: '',
					balance: ''
				}
			},

			links: {
				website: {
					placeholder: function(player) {
						return 'www.' + nameTransform(player) + '.com';
					},
					addon: 'http://'
				},
				facebook: {
					placeholder: nameTransform,
					addon: 'facebook.com/'
				},
				twitter: {
					placeholder: nameTransform,
					addon: '@'
				},
				instagram: {
					placeholder: nameTransform,
					addon: 'instagram.com/'
				},
				pinterest: {
					placeholder: nameTransform,
					addon: 'pinterest.com/'
				},
			},

			populateDefaults: function(player) {
				$.map(service.defaults.player, function(value, key) {
					if(player[key]) return;
					if(typeof value === 'object') {
						player[key] = angular.copy(value);
						return;
					}
					player[key] = value;
				});
				return player;
			}
		};

		return service;
	}

}());
