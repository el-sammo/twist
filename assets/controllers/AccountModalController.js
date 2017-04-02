(function() {
	'use strict';

	var app = angular.module('app');

	app.controller('AccountModalController', controller);
	
	controller.$inject = [
		'$window', '$rootScope', '$scope', '$modalInstance', 'args', 'messenger',
		'payMethodMgmt', 'playerMgmt', 'clientConfig'
	];

	function controller(
		$window, $rootScope, $scope, $modalInstance, args, messenger,
		payMethodMgmt, playerMgmt, clientConfig
	) {

		if(args.pmId) {
			var pmId = args.pmId;
		}

		if(args.playerId) {
			var playerId = args.playerId;

			playerMgmt.getPlayer(playerId).then(function(player) {
				$scope.player = player;
				$scope.address = player.addresses.primary.streetNumber+' '+player.addresses.primary.streetName;
				$scope.city = player.addresses.primary.city;
				$scope.zip = parseInt(player.addresses.primary.zip);
			});
		}

		$scope.payMethod = {};

		$scope.addPaymentMethod = function() {
			$scope.processing = true;

			var paymentData = {
				cardNumber: $scope.payMethod.cardNumber.toString(),
				expirationDate: $scope.payMethod.year + '-' + $scope.payMethod.month,
				cvv2: $scope.payMethod.cvv2
			};

			payMethodMgmt.addPM(paymentData).then(function(player){
				$scope.processing = false;
				messenger.show('The payment method has been added.', 'Success!');
				$modalInstance.dismiss('done');

				$rootScope.$broadcast('playerChanged', player);
			}).catch(function(err) {
				$modalInstance.dismiss('cancel');
			});
		};

		$scope.submitted = 0;

		$scope.required = function(field) {
			if($scope.submitted || field) return;
			return 'error';
		};

		$scope.requiredAddress = function(field) {
			if($scope.submitted) return '';
			if(field && isValidAddress(field)) return '';
			return 'error';
		};

		$scope.removePaymentMethod = function() {
			// TODO: mark pmId as inactive
			console.log('$scope.removePaymentMethod() called with:');
			console.log($scope);
			console.log('pmId: '+pmId);
			$modalInstance.dismiss('done');
		};

		$scope.updateAddress = function() {
			$scope.state = clientConfig.defaultState || 'WY';
			var addressPieces = splitAddress($scope.address);
			var addressObject = {
				streetNumber: addressPieces.streetNumber,
				streetName: addressPieces.streetName,
				apt: $scope.apt,
				city: $scope.city,
				state: $scope.state,
				zip: $scope.zip
			}
			$scope.player.addresses.primary = addressObject;

			playerMgmt.updatePlayer($scope.player).then(function(res) {
			$modalInstance.dismiss('done');
			messenger.show('The address has been updated.', 'Success!');
			});
		};

		function splitAddress(address) {
			var addrInfo = {
				streetNumber: '',
				streetName: ''
			};
			var matches = address.match(/^([0-9]+) (.+)/);
			if(matches) {
				addrInfo.streetNumber = matches[1];
				addrInfo.streetName = matches[2];
			}
			return addrInfo;
		}

		function isValidAddress(address) {
			if(! address) return false;

			var addrInfo = splitAddress($scope.address);
			return addrInfo.streetNumber && addrInfo.streetName;
		};

	}

}());
