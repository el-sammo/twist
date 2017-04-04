(function() {
"use strict";

var app = angular.module('app');

///
// Controllers: Home
///

app.controller('HomeController', controller);

controller.$inject = [
	'$scope', '$http', '$routeParams', '$rootScope', '$location', 
	'$modal', '$timeout', '$window',

	'signupPrompter', 'deviceMgr', 'layoutMgmt',
	'playerMgmt', 'gameMgmt',
	'messenger', 
	'lodash',
	// in angular, there are some angular-defined variables/functions/behaviors
	// that are prefaced with the dollar sign ($)
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt, 
	playerMgmt, gameMgmt,
	messenger, 
	_
) {
	///
	// Variable declaration
	///

	var todayDate;

	$scope.alaska = {};
	$scope.alaska.color = 'blue';
	$scope.alaska.units = 23;

	$scope.northwest_territory = {};
	$scope.northwest_territory.color = 'green';
	$scope.northwest_territory.units = 16;

	$scope.greenland = {};
	$scope.greenland.color = 'purple';
	$scope.greenland.units = 109;

	$scope.alberta = {};
	$scope.alberta.color = 'red';
	$scope.alberta.units = 1;

	$scope.ontario = {};
	$scope.ontario.color = 'yellow';
	$scope.ontario.units = 55;

	///
	// Run initialization
	///

	

	init();


	///
	// Initialization
	///

	function init() {

		if($routeParams.id) {
			$scope.gameExists = true;
			$scope.currentGameId = $routeParams.id;
console.log('gameExists', $scope.gameExists);
console.log('currentGameId', $scope.currentGameId);
		} else {
			$scope.gameExists = false;
			$scope.currentGameId = '';
console.log('gameExists', $scope.gameExists);
console.log('currentGameId', $scope.currentGameId);
		}

		$scope.territoryClaim = territoryClaim;
		$scope.territoryMenu = territoryMenu;

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;

		$scope.account = account;
		$scope.showChallenges = showChallenges;
		$scope.showTournaments = showTournaments;
		$scope.tournamentsSort = tournamentsSort;
		$scope.showTournamentDetails = showTournamentDetails;
		$scope.showTournamentLeaders = showTournamentLeaders;
		$scope.tournamentRegister = tournamentRegister;
		$scope.setActiveTournament = setActiveTournament;


		// For debugging
		$scope.debugLog = debugLog;

		$rootScope.$on('playerLoggedIn', onPlayerLoggedIn);
	}

	function initDate() {
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

		todayDate = parseInt(year +''+ month +''+ date);


		// debug code
		todayDate = 20161201;
	}

	function initTournaments() {
		tournamentMgmt.getTournamentsByDate(todayDate).then(
			onGetTournaments
		);
	}

	///
	// Event handlers
	///
	
	function onPlayerLoggedIn(evt, args) {
		$scope.playerId = args;
		$scope.showLogin = false;
		$scope.showLogout = true;
		$scope.showSignup = false;

		var getPlayerPromise = playerMgmt.getPlayer($scope.playerId);
		getPlayerPromise.then(function(player) {
			$scope.player = player;
		});
	}

	function onGetTournaments(currentTournamentsData) {
		var dateObj = new Date();
		var year = dateObj.getFullYear();
		var month = dateObj.getMonth();
		var date = dateObj.getDate();
		var today = new Date(year, month, date);
		var todayMills = today.getTime();
		var nowMills = (((dateObj.getTime() - todayMills) * -1) / 60);

		$scope.currentTournaments = currentTournamentsData;

		playerMgmt.getSession().then(function(sessionData) {

			if(sessionData.playerId) {
				$rootScope.playerId = sessionData.playerId;
				$scope.playerId = $rootScope.playerId;
				$scope.showLogin = false;
				$scope.showSignup = false;
				$scope.showLogout = true;

				var getPlayerPromise = playerMgmt.getPlayer($scope.playerId);
				getPlayerPromise.then(function(player) {
					$scope.player = player;
				});

			} else {
				$scope.showLogin = true;
				$scope.showSignup = true;
				$scope.showLogout = false;
			}

			var tournaments = [];
			$scope.currentTournaments.forEach(function(tournament) {
				var tournamentData = {};
				tournamentData.id = tournament.id;
				tournamentData.name = tournament.name;
				tournamentData.timeControl = tournament.timeControl;
				tournamentData.entryFee = tournament.entryFee;
				tournamentData.houseFee = tournament.houseFee;
				tournamentPlayersMgmt.getTournamentPlayers(tournament.id).then(function(tournamentPlayers) {
					tournamentData.playersCount = tournamentPlayers.length;
				});
				if(tournament.maxEntries == 99999) {
					tournamentData.maxEntries = 'UNL';
				} else {
					tournamentData.maxEntries = tournament.maxEntries;
				}
				tournamentData.tournamentStatus = tournament.status;
				tournamentData.mts = parseInt((tournament.startTime - nowMills) / 1000);
				tournaments.push(tournamentData);
			});
			$scope.tournamentsData = tournaments;
		});
	}

	///
	// Balance methods
	///
	
	function updateBalance() {
		var getSessionPromise = playerMgmt.getSession();
		getSessionPromise.then(function(sessionData) {
			if(sessionData.playerId) {
				var getPlayerPromise = playerMgmt.getPlayer(sessionData.playerId);
				getPlayerPromise.then(function(player) {
					$scope.player = player;
				});
			}
		});
	}


	///
	// View methods
	///

//	$("#alaska").find(".blueCircle").on('click', function () {
//		console.log($(this).attr('id')); 
//	});

//	$(".blueCircle", "#alaska").on('click', function () {
//		console.log($(this).attr('id')); 
//	});

	$("#alaska div.blueCircle").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#northwest_territory").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#greenland").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#alberta").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#ontario").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#quebec").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#western_us").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#eastern_us").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#central_america").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#venezuela").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#peru").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#brazil").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#argentina").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#iceland").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#scandinavia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#russia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#great_britain").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#northern_europe").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#western_europe").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#southern_europe").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#north_africa").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#egypt").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#east_africa").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#central_africa").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#south_africa").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#madagascar").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#ural").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#siberia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#yakutsk").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#kamchatka").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#irkutsk").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#mongolia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#japan").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#afghanistan").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#china").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#middle_east").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#india").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#southeast_asia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#indonesia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#guinea").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#western_australia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	$("#eastern_australia").on('click', function () {
		console.log($(this).attr('id')); 
	});

	function territoryClaim(obj) {
		var territory = obj.currentTarget.parentNode.id;
console.log('territory: '+territory);
	}

	function territoryMenu(obj) {
		var territory = obj.currentTarget.offsetParent.id;
		var colorPcs = obj.currentTarget.className.split('C');
		var color = colorPcs[0];
console.log('territory: '+territory);
console.log('color: '+color);
	}

	function account() {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			$location.path('/account');
		}
	}

	function tournamentsSort(sortBy) {
		switch(sortBy){
			case'name':
				$scope.tournamentsData.sort(dynamicSort("name"));
				if($scope.tournamentsSortBy === 'name') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'name';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			case'timeControl':
				$scope.tournamentsData.sort(dynamicSort("timeControl"));
				if($scope.tournamentsSortBy === 'timeControl') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'timeControl';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			case'maxEntries':
				$scope.tournamentsData.sort(dynamicSort("maxEntries"));
				if($scope.tournamentsSortBy === 'maxEntries') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'maxEntries';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			case'entryFee':
				$scope.tournamentsData.sort(dynamicSort("entryFee"));
				if($scope.tournamentsSortBy === 'entryFee') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'entryFee';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			case'status':
				$scope.tournamentsData.sort(dynamicSort("tournamentStatus"));
				if($scope.tournamentsSortBy === 'tournamentStatus') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'tournamentStatus';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			case'startTime':
				$scope.tournamentsData.sort(dynamicSort("mts"));
				if($scope.tournamentsSortBy === 'mts') {
					if($scope.tournamentsSortIn === 'asc') {
						$scope.tournamentsData.reverse();
						$scope.tournamentsSortIn = 'desc';
					} else {
						$scope.tournamentsSortIn = 'asc';
					}
				} else {
					$scope.tournamentsSortBy = 'mts';
					$scope.tournamentsSortIn = 'asc';
				}
				break;
			default:
				$scope.tournamentsData.sort(dynamicSort("name"));
				$scope.tournamentsSortBy = 'name';
				$scope.tournamentsSortIn = 'asc';
		}		
	}

	function dynamicSort(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

	function showTournamentDetails(tournyId) {
console.log('showTournamentDetails() called with: '+tournyId);
		var dateObj = new Date();
		var now = dateObj.toString();
console.log('now: '+now);
		var offsetMinutes = dateObj.getTimezoneOffset();
console.log('offsetMinutes: '+offsetMinutes);
//		var getTournamentPromise = tournamentMgmt.getTournament(tournyId);
//		getTournamentPromise.then(function(tournamentData) {
//			$scope.tournamentData = tournamentData;
//		});
//		if(!$scope.showLeaders) {
//			$scope.showTournament = true;
//		}
	}

	function resetTabsStatus() {
		$('#challengesTab').removeClass('beccaTabOn');
		$('#tournamentsTab').removeClass('beccaTabOn');
		$('#challengesTab').addClass('beccaTabOff');
		$('#tournamentsTab').addClass('beccaTabOff');
	}

	function showChallenges() {
		resetTabsStatus();
		$scope.tournamentsShow = false;
		$scope.challengesShow = true;
		$('#challengesTab').removeClass('beccaTabOff');
		$('#challengesTab').addClass('beccaTabOn');
	}

	function showTournaments() {
		resetTabsStatus();
		$scope.challengesShow = false;
		$scope.tournamentsShow = true;
		$('#tournamentsTab').removeClass('beccaTabOff');
		$('#tournamentsTab').addClass('beccaTabOn');
	}

	function showTournamentLeaders(tournyId) {
		$scope.showLeaders = true;
		var getLeadersPromise = tournamentMgmt.getLeaders(tournyId);
		getLeadersPromise.then(function(leadersData) {
			$scope.tournamentLeadersDataTournamentName = leadersData[leadersData.length - 1];
			leadersData.pop();
			var leaderBoardData = [];
			leadersData.forEach(function(leader) {
				var getPlayerPromise = playerMgmt.getPlayer(leader.playerId);
				getPlayerPromise.then(function(playerData) {
					var thisLeader = {};
					thisLeader.id = leader.playerId;
					thisLeader.fName = playerData.fName;
					thisLeader.lName = playerData.lName;
					thisLeader.city = playerData.city;
					thisLeader.username = playerData.username;
					thisLeader.credits = leader.credits;
					leaderBoardData.push(thisLeader);
				});
			});
			$scope.leadersData = leaderBoardData;
		});
		$scope.showTournamentDetails(tournyId);
	}

	function tournamentRegister(tournyId) {
// TODO debug this, including handling errors
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			var registerTournamentPromise = tournamentMgmt.registerTournament(tournyId, $scope.playerId);
			registerTournamentPromise.then(function(response) {
console.log('response.data:');
console.log(response.data);
			});
		}
	}

	function setActiveTournament(tournament) {
		$window.location.href = location.origin + "/app/tournament/" + tournament.id;
	}

	function getMinToPost(postTime) {
		var d = new Date();
		var nowMills = d.getTime();
		var difference = (postTime - nowMills);
		if(difference > 0) {
			return ' ('+parseInt(difference / 60000) + ' M)';
		} else {
			return;
		}
	}

//	setTimeout(function() { 
//		initTournaments();
//	}, 60000);

	///
	// Debugging methods
	///
	
	function debugLog(msg) {
		var args = Array.prototype.slice.call(arguments);
		console.log.apply(console, args);
	}
}

}());
