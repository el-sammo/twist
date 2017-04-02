(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Add Funds Controller
	///


	app.controller('AddFundsController', controller);
	
	controller.$inject = [
		'$rootScope', '$scope', '$http', '$modal',
		'$modalInstance', '$window',
		'navMgr', 'pod', 'layoutMgmt',
		'playerMgmt', 'trdMgmt', 'tournamentMgmt'
	];

	function controller(
		$rootScope, $scope, $http, $modal,
		$modalInstance, $window,
		navMgr, pod, layoutMgmt,
		playerMgmt, trdMgmt, tournamentMgmt
	) {

		if(!$scope.$parent.playerId) {
			layoutMgmt.logIn();
		}

		$scope.generalError = false;
		$scope.insufficientFunds = false;

		var dateObj = new Date();
		var year = dateObj.getFullYear();
		var month = (dateObj.getMonth() + 1);
		var date = dateObj.getDate();

		if(month < 10) {
			month = '0' + month;
		}

		if(date < 10) {
			date = '0' + date;
		}

		var todayDate = year + month + date;
		$scope.todayDate = todayDate;

		var getPlayerPromise = playerMgmt.getPlayer($scope.$parent.playerId);
		getPlayerPromise.then(function(player) {
			$scope.player = player;
		});

		$scope.addFunds = function() {
console.log('$scope.addFunds() called with:');
console.log($scope);
//			if(ctpResponse.data.success) {
//				$modalInstance.dismiss('done');
//				$window.location.href = location.origin + "/app/tournament/" + ctpResponse.data.tournamentData.id;
//			} else {
//				$scope.generalError = true;
//			}
		}
	}

}());
