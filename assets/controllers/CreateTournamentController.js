(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Create Tournament Controller
	///


	app.controller('CreateTournamentController', controller);
	
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
		$scope.showAddFunds = false;
		$scope.showCreateTournament = true;

		$scope.addFunds = function() {
			$scope.showCreateTournament = false;
			$scope.showAddFunds = true;
		}

		$scope.tournament = {};

		$scope.feeOptions = [
			'5.00',
			'10.00',
			'25.00',
			'50.00',
			'100.00',
			'250.00',
			'500.00',
			'1000.00'
		];

		$scope.selEntryFee = $scope.feeOptions[0];

		$scope.pubPrivs = [
			'private',
			'public'
		];

		$scope.selPubPriv = $scope.pubPrivs[0];

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
			var getTrdsPromise = trdMgmt.getTrdsByDate(todayDate);
			getTrdsPromise.then(function(trdsData) {
				$scope.tracks = trdsData;
				$scope.selTrack = $scope.tracks[0].id;
				$scope.updateTournamentName(player, trdsData[0]);
			});
		});

		$scope.updateTournamentName = function(player, track) {
			$scope.useTrack = track;
			$scope.tournament.name = player.city + ' ' +player.fName + '\'s ' + track.name + ' Tournament';
		}

		$scope.createTournament = function() {
			$scope.tournament.tournyDate = parseInt($scope.todayDate);
			$scope.tournament.assocTrackId = $scope.selTrack;
			$scope.tournament.entryFee = parseFloat($scope.selEntryFee);
			$scope.tournament.siteFee = parseFloat(($scope.selEntryFee / 10).toFixed(2));
			$scope.tournament.startTime = $scope.useTrack.races[0].postTime;
			$scope.tournament.players = [$scope.$parent.playerId];
			$scope.tournament.pubPriv = $scope.selPubPriv;

			var dTotal = parseFloat($scope.tournament.entryFee + $scope.tournament.siteFee);

			if($scope.player.dollars < dTotal) {
				$scope.insufficientFunds = true;
			} else {
console.log('not too poor');
				var createTournamentPromise = tournamentMgmt.createCustomTournament($scope.tournament);
				createTournamentPromise.then(function(ctpResponse) {
					if(ctpResponse.data.success) {
						$modalInstance.dismiss('done');
						$window.location.href = location.origin + "/app/tournament/" + ctpResponse.data.tournamentData.id;
					} else {
						$scope.generalError = true;
					}
				});
			}
		}
	}

}());
