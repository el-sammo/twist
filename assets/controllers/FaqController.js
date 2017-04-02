(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Faq
	///
	app.controller('FaqController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope',
		'deviceMgr'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope,
		deviceMgr
	) {

		$scope.showWhat = 'resRef';

		$scope.setShow = function(id) {
			$scope.showWhat = id;
		}

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

	}

}());
