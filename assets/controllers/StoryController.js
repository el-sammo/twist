(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Story
	///
	app.controller('StoryController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope',
		'deviceMgr'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope,
		deviceMgr
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

	}

}());
