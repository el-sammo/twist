(function() {
"use strict";

var app = angular.module('app');

///
// Controllers: Tournament
///

app.controller('TournamentController', controller);

controller.$inject = [
	'$scope', '$http', '$routeParams', '$rootScope', '$location', 
	'$modal', '$timeout', '$window',
	'signupPrompter', 'deviceMgr', 'layoutMgmt',
	'playerMgmt', 'trdMgmt', 'wagerMgmt', 'tournamentMgmt',
	'clientConfig',
	'messenger', 
	'lodash',
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt, 
	playerMgmt, trdMgmt, wagerMgmt, tournamentMgmt,
	clientConfig,
	messenger, 
	_
) {
	///
	// Variable declaration
	///

	var todayDate;
	var legMap, partMap, amountMap, wagerAbbrevMap;


	///
	// Run initialization
	///

	init();


	///
	// Initialization
	///

	function init() {
		if(!$routeParams.id) {
			$location.path('/');
		}

		initDate();
		initTournaments();
		initMaps();
		initRunners();

		$scope.leaderboardsShow = false;
		$scope.horseCenterShow = true;
		$scope.showLeaderWagersId = '';

		$scope.wagerData = {};

		$scope.logIn = layoutMgmt.logIn;
		$scope.signUp = layoutMgmt.signUp;
		$scope.logOut = layoutMgmt.logOut;
		$scope.addFunds = layoutMgmt.addFunds;

		$scope.account = account;
		$scope.createTournament = layoutMgmt.createTournament;

		$scope.showTrack = showTrack;
		$scope.showTrackRace = showTrackRace;
		$scope.showLeg = showLeg;
		$scope.showRaceWager = showRaceWager;
		$scope.scoreRace = scoreRace;
		$scope.updateSelectedRunnersDisplay = updateSelectedRunnersDisplay;
		$scope.clearSelectedRunners = initRunners;
		$scope.setAmount = setAmount;
		$scope.submitWager = submitWager;
		$scope.cancelWager = cancelWager;
		$scope.showHistory = showHistory;
		$scope.showHorseCenter = showHorseCenter;
		$scope.showLeaderboards = showLeaderboards;
		$scope.leaderWagersShow = leaderWagersShow;
		$scope.showTournaments = showTournaments;
		$scope.showConfirmation = showConfirmation;
		$scope.closeRace = closeRace;
		$scope.unCloseRace = unCloseRace;
		$scope.scratchEntry = scratchEntry;
		$scope.unScratchEntry = unScratchEntry;
		$scope.favoriteEntry = favoriteEntry;
		$scope.unFavoriteEntry = unFavoriteEntry;
		$scope.showResults = showResults;
		$scope.showTournamentDetails = showTournamentDetails;
		$scope.showTournamentLeaders = showTournamentLeaders;
		$scope.tournamentRegister = tournamentRegister;
		$scope.tournamentUnregister = tournamentUnregister;
		$scope.setActiveTournament = setActiveTournament;
		$scope.changeActiveTournament = changeActiveTournament;
		$scope.goToTournament = goToTournament;

		$scope.convertPostTime = convertPostTime;
		$scope.allSelect = allSelect;
		$scope.formatPrice = formatPrice;
		$scope.getTournamentMinToPost = getTournamentMinToPost;
		$scope.getRaceMinToPost = getRaceMinToPost;
		$scope.raceNumberTabClass = raceNumberTabClass;
		$scope.wagerTypeTabClass = wagerTypeTabClass;
		$scope.wagerTypeTabStyle = wagerTypeTabStyle;
		$scope.wagerAmountTabClass = wagerAmountTabClass;

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

		todayDate = year + month + date;
	}

	function initTournaments() {
		tournamentMgmt.getTournamentsByDate(todayDate).then(
			onGetTournaments
		);
	}

	function initMaps() {
		legMap = [];
		legMap['Win'] = 1;
		legMap['Place'] = 1;
		legMap['Show'] = 1;
		legMap['Exacta'] = 1;
		legMap['Trifecta'] = 1;
		legMap['Superfecta'] = 1;
		legMap['Pentafecta'] = 1;
		legMap['Daily Double'] = 2;
		legMap['Pick 3'] = 3;
		legMap['Pick 4'] = 4;
		legMap['Pick 5'] = 5;
		legMap['Pick 6'] = 6;
		legMap['Pick 7'] = 7;
		legMap['Pick 8'] = 8;
		legMap['Pick 9'] = 9;
		legMap['Pick 10'] = 10;

		partMap = [];
		partMap['Win'] = 1;
		partMap['Place'] = 1;
		partMap['Show'] = 1;
		partMap['Exacta'] = 2;
		partMap['Trifecta'] = 3;
		partMap['Superfecta'] = 4;
		partMap['Pentafecta'] = 5;
		partMap['Daily Double'] = 1;
		partMap['Pick 3'] = 1;
		partMap['Pick 4'] = 1;
		partMap['Pick 5'] = 1;
		partMap['Pick 6'] = 1;
		partMap['Pick 7'] = 1;
		partMap['Pick 8'] = 1;
		partMap['Pick 9'] = 1;
		partMap['Pick 10'] = 1;

		amountMap = [];
		amountMap[.1] = ['.10','.20','.50','1.00','2.00','5.00','10.00','20.00','50.00','100.00'];
		amountMap[.2] = ['.20','.50','1.00','2.00','3.00','5.00','10.00','20.00','50.00','100.00'];
		amountMap[.5] = ['.50','1.00','2.00','3.00','4.00','5.00','10.00','20.00','50.00','100.00'];
		amountMap[1] = ['1.00','2.00','3.00','4.00','5.00','6.00','10.00','20.00','50.00','100.00'];
		amountMap[2] = ['2.00','3.00','4.00','5.00','6.00','10.00','20.00','25.00','50.00','100.00'];

		wagerAbbrevMap = [];
		wagerAbbrevMap['Win'] = 'Win';
		wagerAbbrevMap['Place'] = 'Place';
		wagerAbbrevMap['Show'] = 'Show';
		wagerAbbrevMap['Exacta'] = 'Exacta';
		wagerAbbrevMap['Trifecta'] = 'Tri';
		wagerAbbrevMap['Superfecta'] = 'Super';
		wagerAbbrevMap['Pentafecta'] = 'SH5';
		wagerAbbrevMap['Daily Double'] = 'DD';
		wagerAbbrevMap['Pick 3'] = 'P3';
		wagerAbbrevMap['Pick 4'] = 'P4';
		wagerAbbrevMap['Pick 5'] = 'P5';
		wagerAbbrevMap['Pick 6'] = 'P6';
		wagerAbbrevMap['Pick 7'] = 'P7';
		wagerAbbrevMap['Pick 8'] = 'P8';
		wagerAbbrevMap['Pick 9'] = 'P9';
		wagerAbbrevMap['Pick 10'] = 'P10';

	}									

	function initRunners() {
		$scope.formattedRunners = '';
		$scope.selectedRunners = [];
		$scope.firstRunners = [];
		$scope.secondRunners = [];
		$scope.thirdRunners = [];
		$scope.fourthRunners = [];
		$scope.fifthRunners = [];
		$scope.leg1Runners = [];
		$scope.leg2Runners = [];
		$scope.leg3Runners = [];
		$scope.leg4Runners = [];
		$scope.leg5Runners = [];
		$scope.leg6Runners = [];
		$scope.leg7Runners = [];
		$scope.leg8Runners = [];
		$scope.leg9Runners = [];
		$scope.leg10Runners = [];
		$scope.allSelected = false;
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

		if($scope.activeTournamentId) {
			var getTournamentPromise = tournamentMgmt.getTournament($scope.activeTournamentId);
			getTournamentPromise.then(function(tournamentData) {
				var showCredits = false;
				tournamentData.players.forEach(function(player) {
					if(player === $scope.playerId) {
						updateActiveTournamentBalance(tournamentData, $scope.playerId);
						showCredits = true;
					}
				});
				if(showCredits) {
					$scope.showRegisterLink = false;
					$scope.showActiveTournamentCredits = true;
				} else {
					$scope.showActiveTournamentCredits = false;
					$scope.showRegisterLink = true;
				}
			});
		}
		$scope.showHistory($scope.playerId);
	}

	function onGetTournaments(currentTournamentsData) {
		var dateObj = new Date();
		var nowMills = dateObj.getTime();
		currentTournamentsData.forEach(function(tournament) {
			tournament.mtp = parseInt((tournament.startTime - nowMills) / 1000);
		});
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
				tournamentData.entryFee = tournament.entryFee;
				tournamentData.siteFee = tournament.siteFee;
				tournamentData.credits = tournament.credits;
				tournamentData.playersCount = tournament.players.length;
				if(tournament.max == 99999) {
					tournamentData.max = 'UNLMTD';
				} else {
					tournamentData.max = tournament.max;
				}
				if(tournament.closed) {
					tournamentData.showTDTimer = false;
					if(tournament.scored) {
						tournamentData.tournamentStatus = 'Finished';
					} else {
						tournamentData.tournamentStatus = 'In Progress';
					}
				} else {
					var mtp = getTournamentMinToPost(tournament.startTime, false, false);
					tournamentData.showTDTimer = true;
					tournamentData.mtp = mtp;
					if(tournament.players.length == tournament.max) {
						tournamentData.tournamentStatus = 'Full';
					} else {
						tournamentData.tournamentStatus = 'Registering';
					}
				}
				tournaments.push(tournamentData);
			});
			$scope.tournamentsData = tournaments;

			var tournamentId = $routeParams.id
			var getTournamentPromise = tournamentMgmt.getTournament(tournamentId);
			getTournamentPromise.then(function(tournament) {
				$scope.setActiveTournament(tournament);
			});

		});

		showLeaderboards();
		showTournamentLeaders($routeParams.id);

//		setTimeout(function() { 
//			initTournaments();
//		}, 60000);
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

	function determinePlayerTournamentCredits(tournamentData, playerId) {
		var credits = tournamentData.credits || 500;
		var getPlayerWagersByTournamentId = wagerMgmt.getPlayerWagersByTournamentId(tournamentData.id +'-'+ playerId);
		return getPlayerWagersByTournamentId.then(function(playerWagers) {
			playerWagers.forEach(function(wager) {
				if(wager.scored) {
					credits += parseFloat(wager.result - wager.wagerTotal);
				} else {
					if(!wager.cancelled) {
						credits -= parseFloat(wager.wagerTotal);
					}
				}
			});
			return parseFloat(credits.toFixed(2));
		});
	}

	function updateActiveTournamentBalance(tournamentData, playerId) {
		var determinePlayerTournamentCreditsPromise = determinePlayerTournamentCredits(tournamentData, playerId);
		determinePlayerTournamentCreditsPromise.then(function(credits) {
			var updateTSCreditsPromise = tournamentMgmt.updateTSCredits(tournamentData.id, playerId, credits);
			updateTSCreditsPromise.then(function(updateTSCreditsPromiseResponse) {
			});
			$scope.activeTournamentCredits = ' Credits: '+(credits).toFixed(2);
		});
	}


	///
	// Wager helpers
	///
	
	function getWagerAbbrev(wager) {
		return wagerAbbrevMap[wager];
	}


	///
	// View methods
	///

	function account() {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			$location.path('/account');
		}
	}

	function showTrack(trackId) {
		$scope.marketingShow = false;
		$scope.trackShow = true;
		$scope.showTrackRace(1, false);
	}

	function showTrackRace(raceNum, override) {
		var trackRaceCount = $scope.track.races.length;
		$scope.track.races.forEach(function(race) {
			if(race.number == raceNum) {
				if(!race.closed || override || $scope.activeTournament.scored) {
					$scope.race = race;
					$scope.raceNum = raceNum;
					$scope.trId = $scope.track.id+'-'+raceNum;
					$scope.showRaceWager(raceNum, 'Win', 2);
				} else {
					raceNum ++;
					if(raceNum > trackRaceCount) {
						override = true;
						$scope.showTrackRace(trackRaceCount, true);
					} else {
						$scope.showTrackRace(raceNum, false);
					}
				}
			}
		});
	}

	function showLeg(legNum) {
		var displayRaceNum = (($scope.raceNum - 1) + legNum);
		var legData = {};
		$scope.track.races.forEach(function(race) {
			if(parseInt(race.number) == displayRaceNum) {
				legData.distance = race.distance;
				legData.surface = race.surface;
				legData.sexes = race.sexes;
				legData.ages = race.ages;
				legData.type = race.type;
				legData.claim = race.claim;
				legData.purse = race.purse;
			}
		});
		$scope.legData = legData;
		$scope.legShow = legNum;
	}

	function showRaceWager(raceNumber, wager, min) {
		$scope.clearSelectedRunners();
		$scope.selectedWager = wager;
		$scope.wagerTmpl = wager;
		$scope.wager = wager;
		$scope.wagerMin = min;

		var track = $scope.track;

		var races = [];
		if(legMap[wager] < 2) {
			$scope.track.races.forEach(function(race) {
				if(race.number == raceNumber) {
					races.push(race);
				}
			});
		} else {
			races.push(
				$.grep(track.races, function(e) { 
					return e.number == raceNumber; 
				})[0]
			);
			var nextLeg = races[0].number;
			while(races.length < legMap[wager]) {
				nextLeg ++;
				races.push(
					$.grep(track.races, function(e) { 
						return e.number == nextLeg; 
					})[0]
				);
			}
		}

		var wagerRunners = [];
		races.forEach(function(race) {
			wagerRunners.push(race.entries);
		});

		$scope.legs = legMap[wager];
		$scope.parts = partMap[wager];

		$scope.singleDesc = wager;

		$scope.wagerRunners = wagerRunners;

		$scope.showLeg(1);

		$scope.amountOptions = amountMap[min];
		$scope.wagerData.amount = amountMap[min][0];

		if($scope.playerId) {	
			$scope.showHistory($scope.playerId);
		} else {
			$scope.showHistory();
		}
	}

	function updateSelectedRunnersDisplay() {
		$scope.formattedRunners = '';
		$scope.multiplier = 1;
		if($scope.legs > 1) {
			var trIdPcs = $scope.trId.split('-');
			$scope.finalRaceId = trIdPcs[0] + '-' + (parseInt(trIdPcs[1]) + (parseInt($scope.legs) - 1));
			var trueLeg1Count = 1;
			if($scope.leg1Runners && ($scope.leg1Runners.length > 0)) {
				var first = true;
				$scope.leg1Runners.forEach(function(runner) {
					if(runner > 0) {
						if(first) {
							$scope.formattedRunners += runner;
							first = false;
						} else {
							$scope.formattedRunners += ',' + runner;
							trueLeg1Count ++;
						}
					}
				});
				$scope.multiplier = $scope.multiplier * trueLeg1Count;
			} 
			$scope.formattedRunners += ' / ';
			var trueLeg2Count = 1;
			if($scope.leg2Runners && ($scope.leg2Runners.length > 0)) {
				var first = true;
				$scope.leg2Runners.forEach(function(runner) {
					if(runner > 0) {
						if(first) {
							$scope.formattedRunners += runner;
							first = false;
						} else {
							$scope.formattedRunners += ',' + runner;
							trueLeg2Count ++;
						}
					}
				});
				$scope.multiplier = $scope.multiplier * trueLeg2Count;
			}
			if($scope.legs > 2) {
				$scope.formattedRunners += ' / ';
				var trueLeg3Count = 1;
				if($scope.leg3Runners && ($scope.leg3Runners.length > 0)) {
					var first = true;
					$scope.leg3Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg3Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg3Count;
				} 
			}
			if($scope.legs > 3) {
				$scope.formattedRunners += ' / ';
				var trueLeg4Count = 1;
				if($scope.leg4Runners && ($scope.leg4Runners.length > 0)) {
					var first = true;
					$scope.leg4Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg4Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg4Count;
				} 
			}
			if($scope.legs > 4) {
				$scope.formattedRunners += ' / ';
				var trueLeg5Count = 1;
				if($scope.leg5Runners && ($scope.leg5Runners.length > 0)) {
					var first = true;
					$scope.leg5Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg5Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg5Count;
				} 
			}
			if($scope.legs > 5) {
				$scope.formattedRunners += ' / ';
				var trueLeg6Count = 1;
				if($scope.leg6Runners && ($scope.leg6Runners.length > 0)) {
					var first = true;
					$scope.leg6Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg6Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg6Count;
				} 
			}
			if($scope.legs > 6) {
				$scope.formattedRunners += ' / ';
				var trueLeg7Count = 1;
				if($scope.leg7Runners && ($scope.leg7Runners.length > 0)) {
					var first = true;
					$scope.leg7Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg7Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg7Count;
				} 
			}
			if($scope.legs > 7) {
				$scope.formattedRunners += ' / ';
				var trueLeg8Count = 1;
				if($scope.leg8Runners && ($scope.leg8Runners.length > 0)) {
					var first = true;
					$scope.leg8Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg8Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg8Count;
				} 
			}
			if($scope.legs > 8) {
				$scope.formattedRunners += ' / ';
				var trueLeg9Count = 1;
				if($scope.leg9Runners && ($scope.leg9Runners.length > 0)) {
					var first = true;
					$scope.leg9Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg9Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg9Count;
				} 
			}
			if($scope.legs > 9) {
				$scope.formattedRunners += ' / ';
				var trueLeg10Count = 1;
				if($scope.leg10Runners && ($scope.leg10Runners.length > 0)) {
					var first = true;
					$scope.leg10Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg10Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg10Count;
				} 
			}
			if($scope.wagerData.amount) {
				$scope.ticketCost = ($scope.multiplier * parseFloat($scope.wagerData.amount)).toFixed(2);
			} else {
				$scope.ticketCost = ($scope.multiplier * 2).toFixed(2);
			}
		} else {
			$scope.finalRaceId = $scope.trId;
			var firstRunnersTrueArray = [];
			var secondRunnersTrueArray = [];
			var thirdRunnersTrueArray = [];
			var fourthRunnersTrueArray = [];
			var fifthRunnersTrueArray = [];
			if(partMap[$scope.wager] > 1) {
				if($scope.firstRunners && ($scope.firstRunners.length > 0)) {
					var first = true;
					$scope.firstRunners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
							}
							firstRunnersTrueArray.push(runner);
						}
					});
				} 
				$scope.formattedRunners += ' / ';
				if($scope.secondRunners && ($scope.secondRunners.length > 0)) {
					var first = true;
					$scope.secondRunners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
							}
							secondRunnersTrueArray.push(runner);
						}
					});
				}
				if(partMap[$scope.wager] > 2) {
					$scope.formattedRunners += ' / ';
					if($scope.thirdRunners && ($scope.thirdRunners.length > 0)) {
						var first = true;
						$scope.thirdRunners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
								}
								thirdRunnersTrueArray.push(runner);
							}
						});
					}
				}
				if(partMap[$scope.wager] > 3) {
					$scope.formattedRunners += ' / ';
					if($scope.fourthRunners && ($scope.fourthRunners.length > 0)) {
						var first = true;
						$scope.fourthRunners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
								}
								fourthRunnersTrueArray.push(runner);
							}
						});
					}
				}
				if(partMap[$scope.wager] > 4) {
					$scope.formattedRunners += ' / ';
					if($scope.fifthRunners && ($scope.fifthRunners.length > 0)) {
						var first = true;
						$scope.fifthRunners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
								}
								fifthRunnersTrueArray.push(runner);
							}
						});
					}
				}
				var multiPartMultiplier = getMultiMulti(
					firstRunnersTrueArray,
					secondRunnersTrueArray,
					thirdRunnersTrueArray,
					fourthRunnersTrueArray,
					fifthRunnersTrueArray
				);
				if(!multiPartMultiplier) {
					multiPartMultiplier = 1;
				}
				if($scope.wagerData.amount) {
					$scope.ticketCost = (multiPartMultiplier * parseFloat($scope.wagerData.amount)).toFixed(2);
				} else {
					$scope.ticketCost = (multiPartMultiplier * 2).toFixed(2);
				}
			} else {
				// WPS
				var first = true;
				var selectedRunnerCount = 1;
				$scope.selectedRunners.forEach(function(runner) {
					if(runner > 0) {
						if(first) {
							$scope.formattedRunners = runner;
							first = false;
						} else {
							$scope.formattedRunners += ',' + runner;
							selectedRunnerCount ++;
						}
					}
				});
				if($scope.wagerData.amount) {
					$scope.ticketCost = (selectedRunnerCount * parseFloat($scope.wagerData.amount)).toFixed(2);
				} else {
					$scope.ticketCost = (selectedRunnerCount * 2).toFixed(2);
				}
			}
		}
	}

	function convertPostTime(postTime) {
		var d = new Date();
		var n = d.getTimezoneOffset() * 1000;
		var localMills = (postTime - n);
		var rt = new Date(localMills);
		var tz = ' ';

		var rtStr = rt.toString();
		var rtPcs = rtStr.split('(');
		if(rtPcs) {
			var pt2Pcs = rtPcs[1].split(')');
			if(pt2Pcs) {
				var spPcs = pt2Pcs[0].split(' ');
				if(spPcs) {
					spPcs.forEach(function(piece) {
						tz += piece.substring(0,1);
					});
				}
			}
		}

		var hours = rt.getHours();
		var minutes = rt.getMinutes();
		var apm = ' am';

		if(hours > 11) {
			apm = ' pm';
			if(hours > 12) {
				hours = (hours - 12);
			}
		}

		if(minutes < 10) {
			minutes = '0' + minutes;
		}

		var formattedRT = hours + ':' + minutes + apm + tz;
		return formattedRT;
	}

	function formatPrice(price) {
		return parseFloat(price).toFixed(2);
	}

	function allSelect(wagerRunners, type, layer) {
console.log('allSelect() called with:');
console.log(wagerRunners);
		if(type === 'h') {
			if(layer == 1) {
				$scope.leg1Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg1Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 2) {
				$scope.leg2Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg2Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 3) {
				$scope.leg3Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg3Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 4) {
				$scope.leg4Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg4Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 5) {
				$scope.leg5Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg5Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 6) {
				$scope.leg6Runners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.leg6Runners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
		}
		if(type === 'v') {
			if(layer == 1) {
				$scope.firstRunners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.firstRunners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 2) {
				$scope.secondRunners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.secondRunners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 3) {
				$scope.thirdRunners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.thirdRunners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 4) {
				$scope.fourthRunners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.fourthRunners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
			if(layer == 5) {
				$scope.fifthRunners = [];
				if($scope.allSelected) {
					updateSelectedRunnersDisplay();
					$scope.allSelected = false;
				} else {
					wagerRunners.forEach(function(runner) {
						if(runner.active) {
							$scope.fifthRunners.push(runner.number);
						}
					});
					updateSelectedRunnersDisplay();
					$scope.allSelected = true;
				}
			}
		}
		if(type === 'wps') {
			$scope.selectedRunners = [];
			if($scope.allSelected) {
				updateSelectedRunnersDisplay();
				$scope.allSelected = false;
			} else {
				wagerRunners.forEach(function(runner) {
					if(runner.active) {
						$scope.selectedRunners.push(runner.number);
					}
				});
				updateSelectedRunnersDisplay();
				$scope.allSelected = true;
			}
		}
	}

	function setAmount(amount) {
		if(amount < $scope.wagerMin) {
			$scope.wagerData.amount = $scope.wagerMin;
			alert('The minimum wager amount is '+$scope.wagerMin);
		} else {
			$scope.wagerData.amount = amount;
		}
		updateSelectedRunnersDisplay();
	}

	function submitWager(activeTournamentId) {
		$scope.successfulWager = '';
		if(!$scope.playerId || !$scope.player.id) {
			layoutMgmt.logIn();
		} else {
			var playerId = $scope.playerId || $scope.player.id;
			var tournamentId = activeTournamentId;
			var wagerAbbrev = getWagerAbbrev($scope.wager);
			// wager schema
			var wagerSubmission = {
				tournamentId: tournamentId,
				tournamentName: $scope.activeTournament.name,
				playerId: playerId,
				trackRaceId: $scope.trId,
				finalRaceId: $scope.finalRaceId,
				wagerPool: $scope.wager,
				wagerAbbrev: wagerAbbrev,
				legs: $scope.legs,
				parts: $scope.parts,
				wagerSelections: $scope.formattedRunners,
				wagerAmount: $scope.wagerData.amount,
				wagerTotal: $scope.ticketCost
			}
			wagerMgmt.submitWager(wagerSubmission).then(function(response) {
				$scope.tabShow = 'wagerResponse';
				if(response.data.success) { 
					$scope.successfulWager = response.data.confirmedWager;
					$scope.wagerError = '';
					var getTournamentPromise = tournamentMgmt.getTournament(activeTournamentId);
					getTournamentPromise.then(function(tournamentData) {
						updateActiveTournamentBalance(tournamentData, playerId);
						showLeaderboards()
						showTournamentLeaders(tournamentId);
					});
				} else {
					if(response.data.failMsg === 'Incomplete Wager Data') {
						$scope.successfulWager = '';
						$scope.wagerError = 'General Wager Error - Please Refresh Your Browser';
						if(response.data.missingPcs.length < 2 && response.data.missingPcs.indexOf('wagerAmount') >=0) {
							$scope.wagerError = 'Please Select a Wager Amount';
						}
					} else {
						$scope.wagerError = response.data.failMsg;
					}
				}
			});
		}
	}

	function cancelWager(wagerId) {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			var cancelWagerPromise = wagerMgmt.cancelWager(wagerId);
			cancelWagerPromise.then(function(response) {
				$scope.tabShow = 'wagerResponse';
				$scope.successfulWager = response[0];
				var tournamentId = $scope.successfulWager.tournamentId;
				var playerId = $scope.successfulWager.playerId;
				var getTournamentPromise = tournamentMgmt.getTournament(tournamentId);
				getTournamentPromise.then(function(tournamentData) {
					updateActiveTournamentBalance(tournamentData, playerId);
					showLeaderboards()
					showTournamentLeaders(tournamentId);
				});
			});
		}
	}

	function scoreRace(trdId, raceNum) {
		$location.path('/scoreRace/' + trdId + '-' + raceNum);
	}

	function showHistory(playerId) {
		if(!playerId) {
			$scope.wagerHistory = [{race: 'No Wagers'}];
			$scope.tabShow = 'wagerHistory';
		} else {
			$scope.tabShow = 'wagerHistory';
			var params = $routeParams.id + '-' + playerId;
			var getPlayerWagersByTournamentIdPromise = wagerMgmt.getPlayerWagersByTournamentId(params);
			getPlayerWagersByTournamentIdPromise.then(function(wagerHistory) {
				if(wagerHistory.length > 0) {
					var formattedHistory = [];
					wagerHistory.forEach(function(wager) {
						var formattedWager = {};
						formattedWager.id = wager.id;
						var trIdPcs = wager.trackRaceId.split('-');
						var trackId = trIdPcs[0];
						var raceNumber = trIdPcs[1];
						formattedWager.race = wager.tournamentName.substr(0,3) +'-'+ raceNumber;
						formattedWager.amount = parseFloat(wager.wagerAmount).toFixed(2);
						formattedWager.type = wager.wagerAbbrev;
						formattedWager.selection = wager.wagerSelections;
						formattedWager.total = wager.wagerTotal;
						var result;
						if(wager.scored) {
							result = wager.result.toFixed(2);
						} else {
							if(wager.cancelled) {
								result = 'C';
							} else {
								if(wager.raceClosed) {
									result = 'Pending';
								} else {
									result = 'Cancel';
								}
							}
						}
						formattedWager.result = result;
						formattedHistory.push(formattedWager);
					});
				}
				if(formattedHistory && formattedHistory.length > 0) {
					$scope.wagerHistory = formattedHistory;
				}	else {
					$scope.wagerHistory = [{race: 'No Wagers'}];
				}
			});
		}
	}

	function showHorseCenter() {
		$scope.leaderboardsShow = false;
		$scope.tournamentsShow = false;
		$scope.horseCenterShow = true;
		$scope.showTournament = false;
		$scope.showLeaders = false;
	}

	function showLeaderboards() {
		$scope.horseCenterShow = false;
		$scope.tournamentsShow = false;
		$scope.leaderboardsShow = true;
		$scope.showTournament = false;
		$scope.showLeaders = false;
	}

	function showTournaments() {
		$scope.horseCenterShow = false;
		$scope.leaderboardsShow = false;
		$scope.tournamentsShow = true;
		$scope.showTournament = false;
		$scope.showLeaders = false;
	}

	function showConfirmation() {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			$scope.tabShow === 'wagerResponse';
		}
	};

	function closeRace(raceNum) {
		var trackData = $scope.track;
		var updateTrdDataPromise = trdMgmt.closeRace(trackData.id, raceNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				var closeWagersPromise = wagerMgmt.closeWagers($scope.track.id+'-'+raceNum);
				closeWagersPromise.then(function(closeWagersPromiseResponse) {
					if(raceNum < 2) {
						var closeTournamentPromise = tournamentMgmt.closeTournament($scope.activeTournament.id);
						closeTournamentPromise.then(function(closeTournamentPromiseResponse) {
							alert('Race '+raceNum+' Closed');
							$location.path("/tournament/" + $scope.activeTournamentId);
						});
					} else {
						alert('Race '+raceNum+' Closed');
						$location.path("/tournament/" + $scope.activeTournamentId);
					}
				});
			} else {
console.log('closeRace() updateTrdDataPromise failed');
			}
		});
	};

	function unCloseRace(raceNum) {
		var trackData = $scope.track;
		var updateTrdDataPromise = trdMgmt.unCloseRace(trackData.id, raceNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				var unCloseWagersPromise = wagerMgmt.unCloseWagers($scope.track.id+'-'+raceNum);
				unCloseWagersPromise.then(function(unCloseWagersPromiseResponse) {
					if(raceNum == 1) {
						var unCloseTournamentPromise = tournamentMgmt.unCloseTournament($scope.activeTournament.id);
						unCloseTournamentPromise.then(function(unCloseTournamentPromiseResponse) {
							alert('Race '+raceNum+' Unclosed (and associated tournament)');
						});
					} else {
						alert('Race '+raceNum+' Unclosed');
					}
				});
			} else {
console.log('unCloseRace() updateTrdDataPromise failed');
			}
		});
	};

	function scratchEntry(entryNum) {
		var trdId = $scope.track.id;
		var raceNum = $scope.raceNum;
		var updateTrdDataPromise = trdMgmt.scratchEntry(trdId, raceNum, entryNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				alert(entryNum+' Scratched');
			} else {
console.log('scratchEntry() updateTrdDataPromise failed');
			}
		});
	};

	function unScratchEntry(entryNum) {
		var trdId = $scope.track.id;
		var raceNum = $scope.raceNum;
		var updateTrdDataPromise = trdMgmt.unScratchEntry(trdId, raceNum, entryNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				alert(entryNum+' Unscratched');
			} else {
console.log('unScratchEntry() updateTrdDataPromise failed');
			}
		});
	};

	function favoriteEntry(entryNum) {
		var trdId = $scope.track.id;
		var raceNum = $scope.raceNum;
		var updateTrdDataPromise = trdMgmt.favoriteEntry(trdId, raceNum, entryNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				alert(entryNum+' indicated as favorite');
			} else {
console.log('favoriteEntry() updateTrdDataPromise failed');
			}
		});
	};

	function unFavoriteEntry(entryNum) {
		var trdId = $scope.track.id;
		var raceNum = $scope.raceNum;
		var updateTrdDataPromise = trdMgmt.unFavoriteEntry(trdId, raceNum, entryNum, $scope.playerId || $scope.player.id);
		updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
			if(updateTrdDataPromiseResponse.success) {
				alert(entryNum+' NOT indicated as favorite');
			} else {
console.log('unFavoriteEntry() updateTrdDataPromise failed');
			}
		});
	};

	function showResults(trdId, raceNum) {
		var raceScoreFound = false;
		var trackName = '';
		var getTrdPromise = trdMgmt.getTrd(trdId);
		getTrdPromise.then(function(track) {
			trackName = track.name;
			$scope.raceResultsTrackRace = trackName + ' Race ' + raceNum;
			track.races.forEach(function(race) {
				if(parseInt(race.number) == parseInt(raceNum)) {
					if(race.score) {
						raceScoreFound = true;
						race.score.trackName = trackName;
						$scope.raceResults = race.score;
					}
				}
			});
			if(raceScoreFound) {
				$scope.raceResultsShow = true;
			} else {
				$scope.raceResultsShow = false;
			}
			$scope.tabShow = 'raceResults';
		});
	}

	function showTournamentDetails(tournyId) {
		var dateObj = new Date();
		var nowMills = dateObj.getTime();
		$scope.showTournamentTimer = false;
		var getTournamentPromise = tournamentMgmt.getTournament(tournyId);
		getTournamentPromise.then(function(tournamentData) {
			$scope.tournamentData = tournamentData;
			if($scope.playerId || $scope.player.id) {
				var playerFound = false;
				var thisPlayerId = $scope.playerId || $scope.player.id;
				$scope.tournamentData.players.forEach(function(player) {
					if(player === thisPlayerId) {
						playerFound = true;
					}
				});
				if(playerFound) {
					$scope.playerRegisteredActiveTournament = true;
				} else {
					$scope.playerRegisteredActiveTournament = false;
				}
			}
			var entryCount = tournamentData.players.length;
			$scope.tournamentData.entryCount = entryCount;
			$scope.tournamentData.prizePool = parseFloat(entryCount * tournamentData.entryFee);
			if(entryCount < 3) {
				$scope.payoutMap = clientConfig.payoutStructure[0];
			}
			if(entryCount > 2 && entryCount < 11) {
				$scope.payoutMap = clientConfig.payoutStructure[1];
			}
			if(entryCount > 10 && entryCount < 31) {
				$scope.payoutMap = clientConfig.payoutStructure[2];
			}
			if(entryCount > 30 && entryCount < 41) {
				$scope.payoutMap = clientConfig.payoutStructure[3];
			}
			if(entryCount > 40 && entryCount < 51) {
				$scope.payoutMap = clientConfig.payoutStructure[4];
			}
			if(entryCount > 50 && entryCount < 61) {
				$scope.payoutMap = clientConfig.payoutStructure[5];
			}
			if((tournamentData.startTime - nowMills) > 0) {
				$scope.tournamentCountdownTimer = parseInt((tournamentData.startTime - nowMills) / 1000);
				$scope.showTournamentTimer = true;
			}
			var tournamentPayoutStructure = [];
			var finishingRank = 1;
			$scope.payoutMap.forEach(function(payout) {
				var thisPayout = {};
				thisPayout.finishingRank = finishingRank;
				thisPayout.payout = ($scope.tournamentData.prizePool * payout).toFixed(2);
				tournamentPayoutStructure.push(thisPayout);
				finishingRank ++;
			});
			$scope.tournamentPayoutStructure = tournamentPayoutStructure;
		});
		if(!$scope.showLeaders) {
			$scope.showTournament = true;
		}
	}

	function showTournamentLeaders(tournyId) {
		if($scope.leaderboardsShow) {
			var tdObj = new Date();
			$scope.showLeaders = true;
			var tournamentClosed = false;
			var getTournamentPromise = tournamentMgmt.getTournament(tournyId);
			getTournamentPromise.then(function(tournamentData) {
				if(tournamentData.closed) {
					tournamentClosed = true;
				}
				$scope.tournamentLeadersDataTournamentName = tournamentData.name;
				var leaderBoardData = [];
				tournamentData.players.forEach(function(player) {
					var getPlayerPromise = playerMgmt.getPlayer(player);
					getPlayerPromise.then(function(playerData) {
						var getPlayerTournamentCreditsPromise = tournamentMgmt.getPlayerTournamentCredits(tournyId + '-' + playerData.id);
						getPlayerTournamentCreditsPromise.then(function(playerCredits) {
							var creditsData = playerCredits[0];
							if(!isNaN(creditsData.credits) &&  creditsData.credits >= 0) {
								var thisLeader = {};
								thisLeader.id = player;
								thisLeader.fName = playerData.fName;
								thisLeader.lName = playerData.lName;
								thisLeader.city = playerData.city;
								thisLeader.username = playerData.username;
								thisLeader.credits = parseFloat(creditsData.credits.toFixed(2));
								leaderBoardData.push(thisLeader);
							} else {
								var determinePlayerTournamentCreditsPromise = determinePlayerTournamentCredits(tournamentData, playerData.id);
								determinePlayerTournamentCreditsPromise.then(function(credits) {
									var updateTSCreditsPromise = tournamentMgmt.updateTSCredits(tournamentData.id, playerData.id, credits);
									updateTSCreditsPromise.then(function(updatePlayerTournamentCreditsPromiseResponse) {
										var thisLeader = {};
										thisLeader.id = player;
										thisLeader.fName = playerData.fName;
										thisLeader.lName = playerData.lName;
										thisLeader.city = playerData.city;
										thisLeader.username = playerData.username;
										thisLeader.credits = parseFloat(credits.toFixed(2));
										leaderBoardData.push(thisLeader);
									});
								});
							}
							leaderBoardData.sort(dynamicSort("credits"));
							leaderBoardData.reverse();
						});
					});
				});
				$scope.leadersData = leaderBoardData;
			});
			$scope.showTournamentDetails(tournyId);
			if($routeParams.id === tournyId && !tournamentClosed) { // <-- no need to continue to perform this if the tournament results are unchanging
				setTimeout(function() { 
					showTournamentLeaders(tournyId);
				}, 60000);
			}
		}
	}

	function leaderWagersShow(leaderId) {
		var getPlayerWagersByTournamentIdPromise = wagerMgmt.getPlayerWagersByTournamentId($routeParams.id + '-' + leaderId);
		getPlayerWagersByTournamentIdPromise.then(function(wagerHistory) {
			var formattedLeaderWagerHistory = [];
			wagerHistory.forEach(function(wager) {
				var thisWager = {};
				var trackRaceIdPcs = wager.trackRaceId.split('-');
				thisWager.race = wager.tournamentName.substr(0,3) + '-' + trackRaceIdPcs[1];
				thisWager.type = wager.wagerAbbrev;
				thisWager.total = wager.wagerTotal;
				if(wager.raceClosed) {
					thisWager.amount = wager.wagerAmount;
					thisWager.selection = wager.wagerSelections;
					if(wager.scored) {
						thisWager.result = wager.result;
					} else {
						thisWager.result = '***';
					}
				} else {
					thisWager.amount = '***';
					thisWager.selection = '***';
					thisWager.result = '***';
				}
				formattedLeaderWagerHistory.push(thisWager);
			});
			$scope.leaderWagers = formattedLeaderWagerHistory;
		});
		$scope.showLeaderWagersId = 'lw' + leaderId;
	}

	function tournamentRegister(tournyId) {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			var registerTournamentPromise = tournamentMgmt.registerTournament(tournyId, $scope.playerId);
			registerTournamentPromise.then(function(response) {
				if(response.data.success) {
					var getTournamentPromise = tournamentMgmt.getTournament(tournyId);
					getTournamentPromise.then(function(tournamentData) {
						showLeaderboards();
						showTournamentLeaders(tournamentData.id);
						$scope.showRegisterLink = false;
						$scope.showActiveTournamentCredits = true;
						updateActiveTournamentBalance(tournamentData, $scope.playerId);
					});
				} else {
console.log('response.data:');
console.log(response.data);
					if(response.data.failMsg.indexOf('Insufficient Funds') > -1) {
						var fmPcs = response.data.failMsg.split(' ');
						$scope.registerFailMsg = 'Your real money account balance ($'+$scope.player.dollars+') is less than the total entry fee ($'+fmPcs[2]+').';
						$scope.registerFailAction = 'addFunds';
					}
				}
			});
		}
	}

	function tournamentUnregister(tournamentData) {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			var unRegisterTournamentPromise = tournamentMgmt.unRegisterTournament(tournamentData.id, $scope.playerId);
			unRegisterTournamentPromise.then(function(response) {
				if(response.data.success) {
					$scope.showRegisterLink = true;
// TODO: why isn't $scope.showRegisterLink updating here?
console.log('$scope:');
console.log($scope);
console.log('successfully unregistered from tournament '+tournamentData.id);
				} else {
console.log('response.data:');
console.log(response.data);
					if(response.data.failMsg.indexOf('Insufficient Funds') > -1) {
						var fmPcs = response.data.failMsg.split(' ');
						$scope.registerFailMsg = 'Your real money account balance ($'+$scope.player.dollars+') is less than the total entry fee ($'+fmPcs[2]+').';
						$scope.registerFailAction = 'addFunds';
					}
				}
			});
		}
	}

	function setActiveTournament(tournament) {
		$scope.activeTournament = tournament;
		var dateObj = new Date();
		var nowMills = dateObj.getTime();
		var getTrdPromise = trdMgmt.getTrd(tournament.assocTrackId);
		getTrdPromise.then(function(trdData) {
			var races = [];
			trdData.races.forEach(function(race) {
				race.mtp = parseInt((race.postTime - nowMills) / 1000);
				races.push(race);
			});
			trdData.races = races;
			races.sort(dynamicSort("number"));
			$scope.track = trdData;
			$scope.activeTournamentId = tournament.id;
			$scope.showTrack($scope.track.id);
		});
		if($scope.playerId || ($scope.player && $scope.player.id)) {
			var playerId = $scope.playerId || $scope.player.id;
			var playerMatchFound = false;
			tournament.players.forEach(function(player) {
				if(player === playerId) {
					playerMatchFound = true;
				}
			});
			if(playerMatchFound) {
				$scope.showRegisterLink = false;
				$scope.showActiveTournamentCredits = true;
				updateActiveTournamentBalance(tournament, playerId);
			} else {
				$scope.showActiveTournamentCredits = false;
				$scope.showRegisterLink = true;
			}
		} else {
			$scope.showActiveTournamentCredits = false;
			$scope.showRegisterLink = true;
		}
	}

	function goToTournament(tournamentId) {
		$location.path("/tournament/" + tournamentId);
	}

	function changeActiveTournament(tournament) {
		$location.path("/tournament/" + tournament.id);
	}

	function raceNumberTabClass(race) {
		if(race.number != $scope.raceNum) {
			return {raceNumberTabOff: true};
		}

		return {raceNumberTabOn: true};
	}

	function wagerTypeTabClass(wager) {
		if($scope.wager === wager.wager) {
			return {
				wagerTypeTabOn: true,
			};
		}

		return {
			wagerTypeTabOff: true,
		};
	}

	function wagerAmountTabClass(amount) {
		if($scope.wagerData.amount === amount) {
			return {
				wagerAmountTabOn: true,
			};
		}

		return {
			wagerAmountTabOff: true,
		};
	}

	function wagerTypeTabStyle(wager) {
		var isWager = $scope.wager === wager.wager;
		var isShort = _.includes(['Tri', 'DD'], wager.abbrev);

		if(isShort) {
			return {
				left: '10px',
				position: 'relative',
			};
		}

		if(isWager) {
			return {
				left: '-2px',
				position: 'relative',
			};
		}

		return {};
	}

	function getTournamentMinToPost(postTime, scored, closed) {
		if(scored) {
			return 'Results';
		}
		if(closed) {
			return 'In Process';
		}
		var d = new Date();
		var nowMills = d.getTime();
		var difference = (postTime - nowMills);
		if(difference > 0) {
			return parseInt(difference / 60000) + ' M';
		} else {
			return;
		}
	}

	function getRaceMinToPost(postTime) {
		var d = new Date();
		var nowMills = d.getTime();
		var difference = (postTime - nowMills);
		if(difference > 0) {
			return parseInt(difference / 60000) + 'M';
		} else {
			return;
		}
	}


	///
	// Input validation
	///

	function getMultiMulti(firsts, seconds, thirds, fourths, fifths) {
		var usedNumbers = [];
		var wagerCombos = [];
		var multiple = 0;

		if(
			firsts.length > 0 && 
			seconds.length > 0 &&
			thirds.length > 0 &&
			fourths.length > 0 &&
			fifths.length > 0 &&
			$scope.wager === 'Pentafecta' &&
			multiple < 1
			) {
			firsts.forEach(function(first) {
				usedNumbers.push(first);
				seconds.forEach(function(second) {
					if(usedNumbers.indexOf(second) < 0) {
						usedNumbers.push(second);
						thirds.forEach(function(third) {
							if(usedNumbers.indexOf(third) < 0) {
								usedNumbers.push(third);
								fourths.forEach(function(fourth) {
									if(usedNumbers.indexOf(fourth) < 0) {
										usedNumbers.push(fourth);
										fifths.forEach(function(fifth) {
											if(usedNumbers.indexOf(fifth) < 0) {
												multiple ++;
												usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2], usedNumbers[3]];
											}
										});
										usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2]];
									}
								});
								usedNumbers = [usedNumbers[0], usedNumbers[1]];
							}
						});
						usedNumbers = [usedNumbers[0]];
					}
				});
				usedNumbers = [];
			});
		}
		if(
			firsts.length > 0 && 
			seconds.length > 0 &&
			thirds.length > 0 &&
			fourths.length > 0 &&
			$scope.wager === 'Superfecta' &&
			multiple < 1
			) {
			firsts.forEach(function(first) {
				usedNumbers.push(first);
				seconds.forEach(function(second) {
					if(usedNumbers.indexOf(second) < 0) {
						usedNumbers.push(second);
						thirds.forEach(function(third) {
							if(usedNumbers.indexOf(third) < 0) {
								usedNumbers.push(third);
								fourths.forEach(function(fourth) {
									if(usedNumbers.indexOf(fourth) < 0) {
										multiple ++;
										usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2]];
									}
								});
								usedNumbers = [usedNumbers[0], usedNumbers[1]];
							}
						});
						usedNumbers = [usedNumbers[0]];
					}
				});
				usedNumbers = [];
			});
		}
		if(
			firsts.length > 0 && 
			seconds.length > 0 &&
			thirds.length > 0 &&
			$scope.wager === 'Trifecta' &&
			multiple < 1
			) {
			firsts.forEach(function(first) {
				usedNumbers.push(first);
				seconds.forEach(function(second) {
					if(usedNumbers.indexOf(second) < 0) {
						usedNumbers.push(second);
						thirds.forEach(function(third) {
							if(usedNumbers.indexOf(third) < 0) {
								usedNumbers.push(third);
								multiple ++;
								usedNumbers = [usedNumbers[0], usedNumbers[1]];
							}
						});
						usedNumbers = [usedNumbers[0]];
					}
				});
				usedNumbers = [];
			});
		}
		if(
			firsts.length > 0 && 
			seconds.length > 0 &&
			$scope.wager === 'Exacta' &&
			multiple < 1
			) {
			firsts.forEach(function(first) {
				usedNumbers.push(first);
				seconds.forEach(function(second) {
					if(usedNumbers.indexOf(second) < 0) {
						multiple ++;
					}
				});
				usedNumbers = [];
			});
		}
		return multiple;
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


	///
	// Debugging methods
	///
	
	function debugLog(msg) {
		var args = Array.prototype.slice.call(arguments);
		console.log.apply(console, args);
	}
}

}());
