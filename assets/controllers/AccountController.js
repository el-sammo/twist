(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Account
	///

	app.controller('AccountController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$rootScope', '$window',
		'messenger', 'payMethodMgmt', 'layoutMgmt', 'playerMgmt',
		'accountMgmt', 'deviceMgr', 'tournamentMgmt'
	];

	function controller(
		$scope, $http, $rootScope, $window, 
		messenger, payMethodMgmt, layoutMgmt, playerMgmt,
		accountMgmt, deviceMgr, tournamentMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		$scope.logOut = layoutMgmt.logOut;

		$scope.showLogin = false;
		$scope.showLogout = true;
		$scope.showSignup = false;

		$scope.addPM = payMethodMgmt.modals.add;
		$scope.removePM = payMethodMgmt.modals.remove;
		$scope.changeAddress = accountMgmt.modals.changeAddress;

		$scope.logOut = layoutMgmt.logOut;

		$scope.setActiveTournament = function(tournament) {
			$window.location.href = location.origin + "/app/tournament/" + tournament.id;
		}

		var sessionPromise = playerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			if(!sessionData.playerId) {
				$window.location.href = '/';
				return;
			}

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

			var getCurrentTournamentsPromise = tournamentMgmt.getTournamentsByDate(todayDate);
			getCurrentTournamentsPromise.then(function(tournamentsData) {
				var dateObj = new Date();
				var nowMills = dateObj.getTime();
				tournamentsData.forEach(function(tournament) {
					tournament.mtp = parseInt((tournament.startTime - nowMills) / 1000);
				});
				$scope.currentTournaments = tournamentsData;
			});

			var playerId = sessionData.playerId;

			$scope.testCharge = function(paymentMethodId) {
console.log('$scope.testCharge() called with PMID: '+paymentMethodId);				
				var testData = {
					total: .02,
					playerId: playerId,
					paymentMethodId: paymentMethodId
				}
console.log('testData:');				
console.log(testData);				

				var createTestChargePromise = reservationMgmt.createTestCharge(testData);
				createTestChargePromise.then(function(response) {
console.log('response:');
console.log(response);
				});
			}

			playerMgmt.getPlayer(playerId).then(function(player) {
				$scope.player = player;

				var getTournamentResultsByPlayerIdPromise = tournamentMgmt.getTournamentResultsByPlayerId(player.id);
				getTournamentResultsByPlayerIdPromise.then(function(resultsData) {
					$scope.results = resultsData;
				});
			});
		});

		$rootScope.$on('playerChanged', function(evt, player) {
			$scope.player = player;
		});
	}
}());
