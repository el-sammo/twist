(function() {
'use strict';

var app = angular.module('app');

app.factory('PerfProfiler', service);

service.$inject = [
	'lodash'
];

function service(
	_
) {
	var profiles = {};
	var stats = {};

	var service = {
		start: start,
		stop: stop,
		printStats: printStats,
	};

	return service;


	function start(name) {
		profiles[name] = new Date();
	}

	function stop(name) {
		var now = new Date();
		stats[name] = now.getTime() - profiles[name].getTime();
	}

	function printStats() {
		console.log(stats);
	}
}

}());
