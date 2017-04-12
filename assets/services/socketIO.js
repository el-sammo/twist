(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('socketIO', function(socketFactory) {
		return socketFactory();
	});

}());
