(function() {
	'use strict';

	var app = angular.module('app', [
		'ngRoute', 'ui.bootstrap', 'angularPayments',
		'angulartics', 'angulartics.google.analytics',
		'uiGmapgoogle-maps', 'bm.bsTour', 'ngLodash',
		'angularSpinner', 'timer', 'ang-drag-drop'
	]);
	var $ = jQuery;


	///
	// Configuration
	///

	app.config(appConfig);

	appConfig.$inject = [
		'$httpProvider',
		'$analyticsProvider',
		'uiGmapGoogleMapApiProvider',
		'clientConfig',
		'usSpinnerConfigProvider',
	];

	function appConfig(
		$httpProvider,
		$analyticsProvider,
		uiGmapGoogleMapApiProvider,
		clientConfig,
		usSpinnerConfigProvider
	) {
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		// Records pages that don't use $state or $route
		$analyticsProvider.firstPageview(true);

		// Records full path
		$analyticsProvider.withAutoBase(true);

		// Async Google maps
		uiGmapGoogleMapApiProvider.configure({
			key: clientConfig.google.apiKey,
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});

		usSpinnerConfigProvider.setDefaults({color: 'white'});
	}


	///
	// Event-Based Services Loader
	///

	app.controller('LoadServices', controller);
	
	controller.$inject = ['errMgr', 'fakeAuth'];

	function controller(errMgr, fakeAuth) {}

}());
