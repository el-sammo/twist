(function() {
	'use strict';

	var app = angular.module('app');

	app.controller('AccountEditController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', 'navMgr', 'messenger', 
		'pod', 'playerSchema', 'playerMgmt'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, navMgr, messenger, 
		pod, playerSchema, playerMgmt
	) {
		navMgr.protect(function() { return $scope.form.$dirty; });
		pod.podize($scope);

		$scope.playerSchema = playerSchema;
		$scope.editMode = true;

		playerMgmt.getPlayer($routeParams.id).then(function(player) {
			$scope.player = playerSchema.populateDefaults(player);
		});

		$scope.save = function save(player, options) {
			options || (options = {});

			// TODO
			// clean phone; integers only

			playerMgmt.updatePlayer(player).then(function() {
				messenger.show('Your account has been updated.', 'Success!');
				$scope.form.$setPristine();
			});
		};

		$scope.cancel = function cancel() {
			navMgr.cancel('/app/account/' +$routeParams.id);
		};
	}

}());
