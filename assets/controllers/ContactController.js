(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Contact
	///
	app.controller('ContactController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$rootScope', 'deviceMgr'
	];

	function controller(
		$scope, $http, $rootScope, deviceMgr
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

	}

}());
