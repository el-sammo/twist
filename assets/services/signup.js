(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Signup
	///

	app.factory('signupPrompter', service);
	
	service.$inject = [
		'$rootScope', 'playerMgmt', 'layoutMgmt'
	];
	
	function service(
		$rootScope, playerMgmt, layoutMgmt
	) {
		var hasPrompted = false;
		var service = {
			prompt: function() {
				if(hasPrompted) return;
				hasPrompted = true;

				playerMgmt.getSession().then(function(sessionData) {
					if(sessionData.playerId) {
						$rootScope.$broadcast('playerLoggedIn');
						return;
					}
					layoutMgmt.signUp();
				});
			},

			welcome: function() {
				playerMgmt.getSession().then(function(sessionData) {
					playerMgmt.setWelcomed(sessionData).then(function(welcomeData) {
						layoutMgmt.welcome();
					});
				});
			},

			disclosure: function() {
				layoutMgmt.disclosure();
			}
		};
		return service;
	}


	app.controller('SignUpController', controller);
	
	controller.$inject = [
		'$scope', '$modalInstance', '$http',
		'$rootScope', '$window', 'clientConfig',
		'layoutMgmt', 'playerMgmt'
	];

	function controller(
		$scope, $modalInstance, $http,
		$rootScope, $window, clientConfig,
		layoutMgmt, playerMgmt
	) {

		$scope.haveAccount = function() {
			$modalInstance.dismiss('cancel');
			layoutMgmt.logIn();
		};

		$scope.validEmail = true;
		$scope.validUsername = true;

		$scope.emailSearch = function() {
			if($scope.email === '') return;

			$http.get('/players/byEmail/' + $scope.email).then(function(res) {
				$scope.validEmail = ! (res.data.length > 0);
			}).catch(function(err) {
				console.log('layoutMgmt: emailSearch ajax failed');
				console.error(err);
			});
		};

		$scope.usernameSearch = function() {
			if($scope.username === '') return;

			$http.get('/players/byUsername/' + $scope.username).then(function(res) {
				$scope.validUsername = ! (res.data.length > 0);
			}).catch(function(err) {
				console.log('layoutMgmt: usernameSearch ajax failed');
				console.error(err);
			});
		};

		$scope.createAccount = function() {
			var player = {
				fName: $scope.fName,
				lName: $scope.lName,
				city: $scope.city,
				email: $scope.email,
				username: $scope.username,
				password: $scope.password
			}

			playerMgmt.createPlayer(player).then(function(playerData) {
				var playerData = playerData.data;
				$modalInstance.dismiss('done');
				$scope.submit({
					username: player.username,
					password: player.password,
					playerId: playerData.id
				});
console.log('preparing to send email to player with id: '+playerData.id);				
				$http.get('/mail/sendConfirmationToPlayer/' + playerData.id).then(function(mailResponse) {
console.log('mailResponse:');
console.log(mailResponse);
				});
			}).catch(function(err) {
				// if players ajax fails...
				console.log('LayoutMgmtController: player-create ajax failed');
				console.error(err);
				$modalInstance.dismiss('cancel');
			});
		};

		$scope.submit = function(credentials) {
			$http.post(
				'/login', credentials
			).success(function(data, status, headers, config) {
				// if login ajax succeeds...
				if(status >= 400) {
					$rootScope.$broadcast('playerLoggedIn', data.playerId);
					$modalInstance.dismiss('done');
				} else if(status == 200) {
					$rootScope.$broadcast('playerLoggedIn', data.playerId);
					$modalInstance.dismiss('done');
				} else {
					$rootScope.$broadcast('playerLoggedIn', data.playerId);
					$modalInstance.dismiss('done');
				}
			}).error(function(err) {
				// if login ajax fails...
				console.log('LayoutMgmtController: logIn ajax failed');
				console.error(err);
				$modalInstance.dismiss('cancel');
			});
		};

	}
}());
