(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('promoMgmt', service);
	
	service.$inject = [
		'$rootScope', '$http'
	];
	
	function service($rootScope, $http) {
		var getPromoPromise;

		var service = {
			getPromo: function(promoCode) {
				var url = '/promos/byName/' + promoCode;
				getPromoPromise = $http.get(url).then(function(res) {
					if(res.data.length > 0) {
						return res.data[0];
					} else {
						return {result: 'invalid'};
					}
				});

				return getPromoPromise;
			}
		}

		return service;
	}

}());
