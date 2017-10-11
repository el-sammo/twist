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
	'playerMgmt', 'gameMgmt', 'chatMgmt', 'actionMgmt',
	'messenger', 
	'lodash',
	// in angular, there are some angular-defined variables/functions/behaviors
	// that are prefaced with the dollar sign ($)
];

function controller(
	$scope, $http, $routeParams, $rootScope, $location,
	$modal, $timeout, $window,
	signupPrompter, deviceMgr, layoutMgmt,
	playerMgmt, gameMgmt, chatMgmt, actionMgmt,
	messenger, 
	_
) {
	///
	// Variable declaration
	///

	$scope.allColors = [
		'blue',
		'green',
		'purple',
		'red',
		'yellow'
	];

	///
	// Run initialization
	///

	

	init();


	///
	// Initialization
	///

	function init() {

		$scope.samDebug = false;

		$scope.showMenu = false;
		$scope.gameShow = false;
		$scope.waiting = false;
		$scope.gameFull = false;
		$scope.showJoinGame = false;
		$scope.showStartGame = false;
		$scope.showLobby = true;
		
		$scope.blueAvailable = true;
		$scope.greenAvailable = true;
		$scope.purpleAvailable = true;
		$scope.redAvailable = true;
		$scope.yellowAvailable = true;

		$scope.addTroops = false;

		hidePickColors();

		$scope.currentColorSelector = '';
		$scope.currentTerritorySelector = '';

		playerMgmt.getSession().then(function(sessionData) {
			if(sessionData.playerId) {
//				$rootScope.playerId = sessionData.playerId;
				$scope.playerId = sessionData.playerId;
				$scope.showLogin = false;
				$scope.showLogout = true;
				$scope.showSignup = false;

				if($routeParams.id) {
					$scope.gameExists = true;
					$scope.showLobby = false;
					$scope.currentGameId = $routeParams.id;
					gameMgmt.getGame($routeParams.id).then(function(gameData) {
						$scope.showStartGame = true;
						$scope.gameData = gameData;

						gameData.players.forEach(function(player) {
							if(player.playerId === $scope.playerId) {
								$scope.waiting = true;
							}
							if(player.color === 'blue') {
								$scope.blueAvailable = true;
							}
							if(player.color === 'green') {
								$scope.greenAvailable = true;
							}
							if(player.color === 'purple') {
								$scope.purpleAvailable = true;
							}
							if(player.color === 'red') {
								$scope.redAvailable = true;
							}
							if(player.color === 'yellow') {
								$scope.yellowAvailable = true;
							}
						});

//						getGameActions(gameData);

						colorTerritories(gameData.territories);
					});
				} else {
					$scope.gameExists = false;
					$scope.currentGameId = '';
					getAvailableGames();
				}

				playerMgmt.getPlayer($scope.playerId).then(function(player) {
					$scope.player = player;
				});
			} else {
				$scope.showLogin = true;
				$scope.showLogout = false;
				$scope.showSignup = true;
			}
		});

		$scope.menuClose = menuClose;
		$scope.createGame = createGame;
		$scope.startGame = startGame;
		$scope.showGame = showGame;
		$scope.hideGame = hideGame;
		$scope.joinGame = joinGame;
		$scope.goToGame = goToGame;
		$scope.chatSend = chatSend;
		$scope.selectColor = selectColor;
		$scope.territoryClaim = territoryClaim;
		$scope.territoryMenu = territoryMenu;
		$scope.assignTroop = assignTroop;

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
		$rootScope.$on('showPickColors', showPickColors);
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

	function getGameActions(gameData) {
		$timeout(function() {
			actionMgmt.getActionsByGameId(gameData.id).then(function(gameActions) {
				if(gameActions && gameActions.length > 0) {
					var currentAction;
					gameActions.forEach(function(action) {
						if(!action.completed) {
							currentAction = action.actionType;
						}
					});
					switch(currentAction) {
						case 'pickingColors':
							pickColors(gameData);
							break;
						default:
console.log('ill-defined currentAction: '+currentAction);
					}
console.log('currentAction: '+currentAction);
				}
				getGameActions(gameData);
			});
		}, 5000);
	}

	function getAvailableGames() {
		$timeout(function() {
			gameMgmt.getAvailGames().then(function(availGames) {
				availGames.data.forEach(function(game) {
					playerMgmt.getPlayer(game.gameCreator).then(function(gameCreator) {
						game.gameCreatorName = gameCreator.username;
					});
					game.playersCount = game.players.length;
				});
				$scope.availGames = availGames.data;
			});
			getAvailableGames();
		}, 3000);
	}

	function selectColor(color) {
		if($scope.playerId === $scope.currentColorSelector) {
			var counter = 0;
			var splicePoint;
			$scope.allColors.forEach(function(allColorsColor) {
				if(color === allColorsColor) {
					splicePoint = counter
				}
				counter ++;
			});
			$scope.allColors.splice(splicePoint, 1);
			gameMgmt.getGame($scope.gameData.id).then(function(gameData) {
				var counter = 0;
				$scope.players.forEach(function(player) {
					if(player.playerId === $scope.playerId) {
						switch(counter) {
							case 0:
								$scope.players[0].color = color;
								gameData.players.forEach(function(gdPlayer) {
									if(gdPlayer.playerId === $scope.playerId) {
										gdPlayer.color = color;
									}
								});
								$scope.firstColorPickGoing = false;
								gameMgmt.updateGame(gameData).then(function(res) {
									shadeColor(color);
									pickSecondColor(gameData, gameData.playerOrder[1]);
								});
								break;
							case 1:
								$scope.players[1].color = color;
								gameData.players.forEach(function(gdPlayer) {
									if(gdPlayer.playerId === $scope.playerId) {
										gdPlayer.color = color;
									}
								});
								$scope.secondColorPickGoing = false;
								gameMgmt.updateGame(gameData).then(function(res) {
									shadeColor(color);
									pickThirdColor(gameData, gameData.playerOrder[2]);
								});
								break;
							case 2:
								$scope.players[2].color = color;
								gameData.players.forEach(function(gdPlayer) {
									if(gdPlayer.playerId === $scope.playerId) {
										gdPlayer.color = color;
									}
								});
								$scope.thirdColorPickGoing = false;
								gameMgmt.updateGame(gameData).then(function(res) {
									shadeColor(color);
									pickFourthColor(gameData, gameData.playerOrder[3]);
								});
								break;
							case 3:
								$scope.players[3].color = color;
								gameData.players.forEach(function(gdPlayer) {
									if(gdPlayer.playerId === $scope.playerId) {
										gdPlayer.color = color;
									}
								});
								$scope.fourthColorPickGoing = false;
								gameMgmt.updateGame(gameData).then(function(res) {
									shadeColor(color);
									pickFifthColor(gameData, gameData.playerOrder[4]);
								});
								break;
							case 4:
								$scope.players[4].color = color;
								gameData.players.forEach(function(gdPlayer) {
									if(gdPlayer.playerId === $scope.playerId) {
										gdPlayer.color = color;
									}
								});
								$scope.fifthColorPickGoing = false;
								hidePickColors();
								gameMgmt.updateGame(gameData).then(function(res) {
									shadeColor(color);
									// user-chosen territories
									if(res.data.assignType === 'choose') {
										pickTerritories(res.data);
									// randomly-chosen territories
									} else {
										if($scope.playerId === gameData.gameCreator) {
											gameMgmt.getRandomTerritories(res.data).then(function(territories) {
												assignTerritories(res.data, territories.data);
											});
										}
									}
								});
								break;
							default:
console.log('color selector error');
						}
					}
					counter ++;
				});
			});
		}
	}

	function territoryClaim(obj) {
		var territory = obj.currentTarget.parentNode.id;
console.log('territory: '+territory);
	}

	function territoryMenu(obj, internal) {
		if(internal) {
			$scope.territory = {};
			$scope.territory.nameUgly = obj.name;
			var tName = '';
			var tNamePcs = obj.name.split('_');
			var firstTNP = true;
			tNamePcs.forEach(function(namePc) {
				if(firstTNP) {
					tName += namePc.charAt(0).toUpperCase() + namePc.substr(1);
					firstTNP = false;
				} else {
					tName += ' ';
					tName += namePc.charAt(0).toUpperCase() + namePc.substr(1);
				}
			})
		} else {
			$scope.territory = {};
			$scope.territory.nameUgly = obj.currentTarget.offsetParent.id;
			var tName = '';
			var tNamePcs = obj.currentTarget.offsetParent.id.split('_');
			var firstTNP = true;
			tNamePcs.forEach(function(namePc) {
				if(firstTNP) {
					tName += namePc.charAt(0).toUpperCase() + namePc.substr(1);
					firstTNP = false;
				} else {
					tName += ' ';
					tName += namePc.charAt(0).toUpperCase() + namePc.substr(1);
				}
			})
		}

		if($scope.addTroops) {
// TODO must prevent players from adding troops out-of-turn
			gameMgmt.getGame($scope.gameData.id).then(function(gameData) {
				var cpuPlayer = false;
				var activePlayerInOrder;
				var apIdx = 0;
				var nextAPIdx = 1;
				var orderedCurrentPlayerFound = false;
				gameData.playerOrder.forEach(function(playerInOrder) {
					if(!orderedCurrentPlayerFound) {
						if(playerInOrder.current) {
							activePlayerInOrder = playerInOrder.playerId;
							$scope.currentPlayerTurnId = playerInOrder.playerId;
							orderedCurrentPlayerFound = true;
						} else {
							if(apIdx > 3) {
								apIdx = 0;
								nextAPIdx = 1;
							} else {
								apIdx ++;
								nextAPIdx ++;
								if(nextAPIdx > 4) {
									nextAPIdx = 0;
								}
							}
						}
					}
				})
				if($scope.currentPlayerTurnId === '58e17f53a719ff42d05742d8') {
					cpuPlayer = true;
					activePlayerInOrder = '58e17f53a719ff42d05742d8';
				}
				if($scope.currentPlayerTurnId === '58e17f63a719ff42d05742d9') {
					cpuPlayer = true;
					activePlayerInOrder = '58e17f63a719ff42d05742d9';
				}
				if($scope.currentPlayerTurnId === '58e17f6ea719ff42d05742da') {
					cpuPlayer = true;
					activePlayerInOrder = '58e17f6ea719ff42d05742da';
				}
				if($scope.currentPlayerTurnId === '58e17f7da719ff42d05742db') {
					cpuPlayer = true;
					activePlayerInOrder = '58e17f7da719ff42d05742db';
				}
				if($scope.currentPlayerTurnId === '58e17f89a719ff42d05742dc') {
					cpuPlayer = true;
					activePlayerInOrder = '58e17f89a719ff42d05742dc';
				}
				if(
					(
						$scope.activePlayer.playerId === $scope.playerId && 
						activePlayerInOrder === $scope.playerId
					) || (
						cpuPlayer
					)
				) {
					var ptHash = gameData.id+'-'+activePlayerInOrder;
					if(cpuPlayer) {
console.log('ptHash: '+ptHash);
					} else {
					}
					var troopsLeft = 10;
					gameMgmt.getPlayerTerritories(ptHash).then(function(playerTerritories) {
						playerTerritories.forEach(function(territory) {
							troopsLeft -= territory.units;
						});
console.log('troops left: '+troopsLeft);
						if(troopsLeft) {
							var verifiedTerritory = false;
							gameData.territories.forEach(function(territory) {
								if(!verifiedTerritory) {
									var tNA = territory.name;
									var tNB = tName.toLowerCase().replace(' ','_');
									if(
										tNA === tNB && 
										(
											(territory.playerId === $scope.activePlayer.playerId) ||
											(territory.playerId === activePlayerInOrder)
										) && 
										(
											(territory.playerId === $scope.playerId) ||
											(territory.playerId === activePlayerInOrder)
										)
									) {
										territory.units ++;
										if(tName.toLowerCase().replace(' ','_') === 'alaska') {
											$scope.alaska.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'northwest_territory') {
											$scope.northwest_territory.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'greenland') {
											$scope.greenland.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'alberta') {
											$scope.alberta.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'ontario') {
											$scope.ontario.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'quebec') {
											$scope.quebec.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'western_us') {
											$scope.western_us.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'eastern_us') {
											$scope.eastern_us.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'central_america') {
											$scope.central_america.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'venezuela') {
											$scope.venezuela.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'peru') {
											$scope.peru.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'brazil') {
											$scope.brazil.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'argentina') {
											$scope.argentina.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'iceland') {
											$scope.iceland.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'scandinavia') {
											$scope.scandinavia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'russia') {
											$scope.russia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'great_britain') {
											$scope.great_britain.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'northern_europe') {
											$scope.northern_europe.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'western_europe') {
											$scope.western_europe.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'southern_europe') {
											$scope.southern_europe.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'north_africa') {
											$scope.north_africa.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'egypt') {
											$scope.egypt.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'east_africa') {
											$scope.east_africa.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'central_africa') {
											$scope.central_africa.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'south_africa') {
											$scope.south_africa.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'madagascar') {
											$scope.madagascar.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'ural') {
											$scope.ural.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'siberia') {
											$scope.siberia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'yakutsk') {
											$scope.yakutsk.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'kamchatka') {
											$scope.kamchatka.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'irkutsk') {
											$scope.irkutsk.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'mongolia') {
											$scope.mongolia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'japan') {
											$scope.japan.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'afghanistan') {
											$scope.afghanistan.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'china') {
											$scope.china.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'middle_east') {
											$scope.middle_east.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'india') {
											$scope.india.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'southeast_asia') {
											$scope.southeast_asia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'indonesia') {
											$scope.indonesia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'guinea') {
											$scope.guinea.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'western_australia') {
											$scope.western_australia.units ++;
										}
										if(tName.toLowerCase().replace(' ','_') === 'eastern_australia') {
											$scope.eastern_australia.units ++;
										}
//										gameData.playerOrder.forEach(function(player) {
//											if(
//												(player.playerId === $scope.activePlayer.playerId) ||
//												(player.playerId === activePlayerInOrder)
//											) {
//												player.troopsToAssign --;
//											}
//										});
										gameData.playerOrder[apIdx].current = false;
										gameData.playerOrder[nextAPIdx].current = true;
										gameMgmt.updateGame(gameData).then(function(uGameData) {
											$scope.currentPlayerTurnId = gameData.playerOrder[nextAPIdx].playerId;
											$scope.gameData = gameData;
											// have computer players assign troops
											if(
												$scope.currentPlayerTurnId === '58e17f53a719ff42d05742d8' ||
												$scope.currentPlayerTurnId === '58e17f63a719ff42d05742d9' ||
												$scope.currentPlayerTurnId === '58e17f6ea719ff42d05742da' ||
												$scope.currentPlayerTurnId === '58e17f7da719ff42d05742db' ||
												$scope.currentPlayerTurnId === '58e17f89a719ff42d05742dc'
											) {
												var gamePlayerHash = $scope.gameData.id +'-'+ $scope.currentPlayerTurnId;
												gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
													playerTerritories.sort(dynamicSort("units"));
													territoryMenu(playerTerritories[0], true);
												});
											}
										});
									}
								}
							});
						} else {
console.log('no troops left - looking for next player');
							var gamePlayerHash = $scope.gameData.id +'-'+ $scope.gameData.playerOrder[0].playerId;
							var firstPTroopDiff = 10;
							gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
								playerTerritories.forEach(function(playerTerritory) {
									if(playerTerritory.units) {
										firstPTroopDiff -= parseInt(playerTerritory.units);
									}
								});
								if(firstPTroopDiff > 0) {
									$scope.currentPlayerTurnId = $scope.gameData.playerOrder[0].playerId;
									playerTerritories.sort(dynamicSort("units"));
console.log('assigning troops to:');
console.log(playerTerritories[0]);
									territoryMenu(playerTerritories[0], true);
								} else {
									var gamePlayerHash = $scope.gameData.id +'-'+ $scope.gameData.playerOrder[1].playerId;
									var secondPTroopDiff = 10;
									gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
										playerTerritories.forEach(function(playerTerritory) {
											if(playerTerritory.units) {
												secondPTroopDiff -= playerTerritory.units;
											}
										});
										if(secondPTroopDiff > 0) {
											$scope.currentPlayerTurnId = $scope.gameData.playerOrder[1].playerId;
											playerTerritories.sort(dynamicSort("units"));
console.log('assigning troops to:');
console.log(playerTerritories[0]);
											territoryMenu(playerTerritories[0], true);
										} else {
											var gamePlayerHash = $scope.gameData.id +'-'+ $scope.gameData.playerOrder[2].playerId;
											var thirdPTroopDiff = 10;
											gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
												playerTerritories.forEach(function(playerTerritory) {
													if(playerTerritory.units) {
														thirdPTroopDiff -= playerTerritory.units;
													}
												});
												if(thirdPTroopDiff > 0) {
													$scope.currentPlayerTurnId = $scope.gameData.playerOrder[2].playerId;
													playerTerritories.sort(dynamicSort("units"));
console.log('assigning troops to:');
console.log(playerTerritories[0]);
													territoryMenu(playerTerritories[0], true);
												} else {
													var gamePlayerHash = $scope.gameData.id +'-'+ $scope.gameData.playerOrder[3].playerId;
													var fourthPTroopDiff = 10;
													gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
														playerTerritories.forEach(function(playerTerritory) {
															if(playerTerritory.units) {
																fourthPTroopDiff -= playerTerritory.units;
															}
														});
														if(fourthPTroopDiff > 0) {
															$scope.currentPlayerTurnId = $scope.gameData.playerOrder[3].playerId;
															playerTerritories.sort(dynamicSort("units"));
console.log('assigning troops to:');
console.log(playerTerritories[0]);
															territoryMenu(playerTerritories[0], true);
														} else {
															var gamePlayerHash = $scope.gameData.id +'-'+ $scope.gameData.playerOrder[4].playerId;
															var fifthPTroopDiff = 10;
															gameMgmt.getPlayerTerritories(gamePlayerHash).then(function(playerTerritories) {
																playerTerritories.forEach(function(playerTerritory) {
																	if(playerTerritory.units) {
																		fifthPTroopDiff -= playerTerritory.units;
																	}
																});
																if(fifthPTroopDiff > 0) {
																	$scope.currentPlayerTurnId = $scope.gameData.playerOrder[4].playerId;
																	playerTerritories.sort(dynamicSort("units"));
console.log('assigning troops to:');
console.log(playerTerritories[0]);
																	territoryMenu(playerTerritories[0], true);
																} else {
console.log('finally done - time to close action');
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				} else {
console.log('not active (current) player:');
console.log($scope.activePlayer);
				}
			});
		} else {
			menuShow();
			$scope.territory.name = tName;
			var colorPcs = obj.currentTarget.className.split('C');
			var color = colorPcs[0];
console.log('territory', $scope.territory);
console.log('color: '+color);
		}
	}

	function menuShow() {
		$scope.showMenu = true;
	}

	function menuClose() {
		$scope.showMenu = false;
	}

	function chatSend(gameId) {
		if(!$scope.player) {
			layoutMgmt.logIn();
		} else {
			var chatMsg = $('#newChatMsg').val();
			sendChat(gameId, chatMsg);
		}
	}

	function sendChat(gameId, msg) {
		$('#newChatMsg').val("");
		var thisChat = {};
		thisChat.gameId = gameId;
		thisChat.playerId = $scope.player.id;
		thisChat.msg = msg;
		thisChat.username = $scope.player.username;
		chatMgmt.createChat(thisChat).then(function(res) {
			getChat(gameId);
		});
	}

	function getChat(gameId) {
		if($scope.gameShow) {
			$timeout(function() {
				chatMgmt.getChatByGameId(gameId).then(function(res) {
					var gameChats = [];
					res.forEach(function(chat) {
						gameChats.push(chat.username +': '+ chat.msg);
					});
					$scope.chats = gameChats;
				});
				getChat(gameId);
			}, 750);
		}
	}

	function joinGame(passedGameData) {
		gameMgmt.getGame(passedGameData.id).then(function(gameData) {
			if(!$scope.playerId) {
				layoutMgmt.logIn();
			} else {
				if(gameData.players) {
					if(gameData.players.length < 5) {
						gameData.players.push({playerId: $scope.playerId})
						gameMgmt.updateGame(gameData).then(function(updatedGameData) {
							$window.location.href = location.origin + "/app/" + updatedGameData.data.id;
							$scope.waiting = true;
						});
					} else {
						$scope.gameFull = true;
					}
				} else {
					gameData.players = [{playerId: $scope.playerId}];
					gameMgmt.addPlayer(gameData).then(function(updatedGameData) {
						$window.location.href = location.origin + "/app/" + updatedGameData.data.id;
					});
				}
			}
		});
	}

	function goToGame(gameId) {
		$window.location.href = location.origin + "/app/" + gameId;
		$scope.waiting = true;
	}

	function createGame() {
		if(!$scope.playerId) {
			layoutMgmt.logIn();
		} else {
			var gameOptions = {};

			gameOptions.gameCreator = $scope.playerId;

			if($scope.assignType && $scope.assignType === 'choose') {
				gameOptions.assignType = 'choose';
			} else {
				gameOptions.assignType = 'random';
			}

			if($scope.award && $scope.award === 'increase') {
				gameOptions.awardType = 'increase';
			} else {
				gameOptions.awardType = 'same';
			}

			gameMgmt.createNewGame(gameOptions).then(function(gameData) {
				gameData.players = [];
				joinGame(gameData.data);
			});
		}
	}

	function showGame(gameId) {
		$scope.joinPossible = true;
		$scope.goToPossible = false;
		$scope.gameShow = true;
		getChat(gameId);
		var gamePlayers = [];
		gameMgmt.getGame(gameId).then(function(gameData) {
			playerMgmt.getPlayer(gameData.gameCreator).then(function(gameCreator) {
				gameData.gameCreatorName = gameCreator.username;
				gameData.players.forEach(function(player) {
					if(player.playerId === $scope.player.id) {
						$scope.joinPossible = false;
						$scope.goToPossible = true;
					}
					playerMgmt.getPlayer(player.playerId).then(function(playerData) {
						gamePlayers.push({
							name: playerData.fName + ' ' + playerData.lName,
							username: playerData.username,
							id: playerData.id
						});
						gameData.gamePlayers = gamePlayers;
					});
				});
				$scope.game = gameData;
			});
		});
	}

	function hideGame() {
		$scope.gameShow = false;
	}

	function startGame(gameData) {
		$scope.showStartGame = false;
		if($scope.playerId === gameData.gameCreator) {
			gameMgmt.getGame(gameData.id).then(function(thisGameData) {
				var newAction = {
					gameId: thisGameData.id,
					actionType: 'addingPlayers',
					playerId: thisGameData.gameCreator,
					completed: false
				};
				actionMgmt.createAction(newAction).then(function(res) {
					if(thisGameData.players.length < 5) {
						addComputerPlayers(thisGameData);
					} else {
						getOrder(gameData);
					}
				});
			});
		}
	}

	function addComputerPlayers(gameData) {
		gameMgmt.addComputerPlayers(gameData).then(function(cpuGameData) {
			getOrder(cpuGameData.data);
		});
	}

	function showPickColors() {
		$scope.showPickColors = true;
	}

	function hidePickColors() {
		$scope.showPickColors = false;
	}

	function pickColors(gameData) {
		var colorsGameData;
		if(gameData.data) {
			colorsGameData = gameData.data;
		} else {
			colorsGameData = gameData;
		}
		actionMgmt.getActionsByGameId(colorsGameData.id).then(function(gameActions) {
			gameActions.forEach(function(gameAction) {
				if(gameAction.actionType === 'orderingPlayers') {
					gameAction.completed = true;
					actionMgmt.updateAction(gameAction).then(function(updatedGameAction) {
						var newAction = {
							gameId: colorsGameData.id,
							actionType: 'pickingColors',
							playerId: colorsGameData.gameCreator,
							completed: false
						};
						actionMgmt.createAction(newAction).then(function(createNewActionRes) {
							$rootScope.$broadcast('showPickColors', colorsGameData.id);
							gameMgmt.getGame(colorsGameData.id).then(function(gameData) {
								pickFirstColor(gameData, gameData.playerOrder[0]);
							});
						});
					});
				}
			});
		});
	}

	function pickFirstColor(gameData, firstPlayer) {
		$scope.firstColorPickGoing = true;
		$scope.currentColorSelector = firstPlayer.playerId;
		$scope.currentPlayerTurnId = firstPlayer.playerId;
		playerMgmt.getPlayer(firstPlayer.playerId).then(function(playerData) {
			$scope.currentColorPicker = playerData.fName + ' ' + playerData.lName;
			$timeout(function() {
				if($scope.firstColorPickGoing) {
					var chosenColor = chooseRandomColor(gameData);
					$scope.players[0].color = chosenColor;
					gameData.players.forEach(function(gdPlayer) {
						if(gdPlayer.playerId === firstPlayer.playerId) {
							gdPlayer.color = chosenColor;
						}
					});
					$scope.firstColorPickGoing = false;
					gameMgmt.updateGame(gameData).then(function(res) {
						pickSecondColor(gameData, gameData.playerOrder[1]);
					});
				}
			}, 10000);
		});
	}

	function pickSecondColor(gameData, secondPlayer) {
		$scope.secondColorPickGoing = true;
		$scope.currentColorSelector = secondPlayer.playerId;
		$scope.currentPlayerTurnId = secondPlayer.playerId;
		playerMgmt.getPlayer(secondPlayer.playerId).then(function(playerData) {
			$scope.currentColorPicker = playerData.fName + ' ' + playerData.lName;
			$timeout(function() {
				if($scope.secondColorPickGoing) {
					var chosenColor = chooseRandomColor(gameData);
					$scope.players[1].color = chosenColor;
					gameData.players.forEach(function(gdPlayer) {
						if(gdPlayer.playerId === secondPlayer.playerId) {
							gdPlayer.color = chosenColor;
						}
					});
					$scope.secondColorPickGoing = false;
					gameMgmt.updateGame(gameData).then(function(res) {
						pickThirdColor(gameData, gameData.playerOrder[2]);
					});
				}
			}, 10000);
		});
	}

	function pickThirdColor(gameData, thirdPlayer) {
		$scope.thirdColorPickGoing = true;
		$scope.currentColorSelector = thirdPlayer.playerId;
		$scope.currentPlayerTurnId = thirdPlayer.playerId;
		playerMgmt.getPlayer(thirdPlayer.playerId).then(function(playerData) {
			$scope.currentColorPicker = playerData.fName + ' ' + playerData.lName;
			$timeout(function() {
				if($scope.thirdColorPickGoing) {
					var chosenColor = chooseRandomColor(gameData);
					$scope.players[2].color = chosenColor;
					gameData.players.forEach(function(gdPlayer) {
						if(gdPlayer.playerId === thirdPlayer.playerId) {
							gdPlayer.color = chosenColor;
						}
					});
					$scope.thirdColorPickGoing = false;
					gameMgmt.updateGame(gameData).then(function(res) {
						pickFourthColor(gameData, gameData.playerOrder[3]);
					});
				}
			}, 10000);
		});
	}

	function pickFourthColor(gameData, fourthPlayer) {
		$scope.fourthColorPickGoing = true;
		$scope.currentColorSelector = fourthPlayer.playerId;
		$scope.currentPlayerTurnId = fourthPlayer.playerId;
		playerMgmt.getPlayer(fourthPlayer.playerId).then(function(playerData) {
			$scope.currentColorPicker = playerData.fName + ' ' + playerData.lName;
			$timeout(function() {
				if($scope.fourthColorPickGoing) {
					var chosenColor = chooseRandomColor(gameData);
					$scope.players[3].color = chosenColor;
					gameData.players.forEach(function(gdPlayer) {
						if(gdPlayer.playerId === fourthPlayer.playerId) {
							gdPlayer.color = chosenColor;
						}
					});
					$scope.fourthColorPickGoing = false;
					gameMgmt.updateGame(gameData).then(function(res) {
						pickFifthColor(gameData, gameData.playerOrder[4]);
					});
				}
			}, 10000);
		});
	}

	function pickFifthColor(gameData, fifthPlayer) {
		$scope.fifthColorPickGoing = true;
		$scope.currentColorSelector = fifthPlayer.playerId;
		$scope.currentPlayerTurnId = fifthPlayer.playerId;
		playerMgmt.getPlayer(fifthPlayer.playerId).then(function(playerData) {
			$scope.currentColorPicker = playerData.fName + ' ' + playerData.lName;
			$timeout(function() {
				if($scope.fifthColorPickGoing) {
					var chosenColor = chooseRandomColor(gameData);
					$scope.players[4].color = chosenColor;
					gameData.players.forEach(function(gdPlayer) {
						if(gdPlayer.playerId === fifthPlayer.playerId) {
							gdPlayer.color = chosenColor;
						}
					});
					$scope.fifthColorPickGoing = false;
					gameMgmt.updateGame(gameData).then(function(res) {
						actionMgmt.getActionsByGameId(gameData.id).then(function(gameActions) {
							if(gameActions && gameActions.length > 0) {
								var currentAction;
								gameActions.forEach(function(action) {
									if(!action.completed && action.actionType === 'pickingColors') {
										action.completed = true;
										actionMgmt.updateAction(action).then(function(updatedAction) {
										});
									}
								});
							}
						});
						
						hidePickColors();
						$scope.currentPlayerTurnId = '';
						// user-chosen territories
						if(res.data.assignType === 'choose') {
							pickTerritories(res.data);
						// randomly-chosen territories
						} else {
							gameMgmt.getRandomTerritories(res.data).then(function(territories) {
								assignTerritories(res.data, territories.data);
							});
						}
					});
				}
			}, 10000);
		});
	}

	function assignTerritories(gameData, territories) {
		if($scope.playerId === gameData.gameCreator) {
			var gameTerritories = [];
			var counter = 0;
			territories.forEach(function(territory) {
				if(counter > 4) {
					counter = 0;
				}
				gameTerritories.push(
					{
						playerId: $scope.players[counter].playerId,
						color: $scope.players[counter].color,
						units: 1,
						name: territory.name
					}
				)
				counter ++;
			});

			colorTerritories(gameTerritories);

			gameData.territories = gameTerritories;
			gameData.playerOrder[0].active = true;
			gameData.playerOrder[1].active = true;
			gameData.playerOrder[2].active = true;
			gameData.playerOrder[3].active = true;
			gameData.playerOrder[4].active = true;
			gameData.playerOrder[0].current = true;
			gameData.playerOrder[1].current = false;
			gameData.playerOrder[2].current = false;
			gameData.playerOrder[3].current = false;
			gameData.playerOrder[4].current = false;

			gameMgmt.updateGame(gameData).then(function(tGameData) {
				assignTroops(tGameData.data);
			})
		}
	}

	function colorTerritories(territories) {
		territories.forEach(function(territory) {
			switch(territory.name) {
				case 'alaska':
					$scope.alaska = territory;
					break;
				case 'northwest_territory':
					$scope.northwest_territory = territory;
					break;
				case 'greenland':
					$scope.greenland = territory;
					break;
				case 'alberta':
					$scope.alberta = territory;
					break;
				case 'ontario':
					$scope.ontario = territory;
					break;
				case 'quebec':
					$scope.quebec = territory;
					break;
				case 'western_us':
					$scope.western_us = territory;
					break;
				case 'eastern_us':
					$scope.eastern_us = territory;
					break;
				case 'central_america':
					$scope.central_america = territory;
					break;
				case 'venezuela':
					$scope.venezuela = territory;
					break;
				case 'peru':
					$scope.peru = territory;
					break;
				case 'brazil':
					$scope.brazil = territory;
					break;
				case 'argentina':
					$scope.argentina = territory;
					break;
				case 'iceland':
					$scope.iceland = territory;
					break;
				case 'scandinavia':
					$scope.scandinavia = territory;
					break;
				case 'russia':
					$scope.russia = territory;
					break;
				case 'great_britain':
					$scope.great_britain = territory;
					break;
				case 'northern_europe':
					$scope.northern_europe = territory;
					break;
				case 'western_europe':
					$scope.western_europe = territory;
					break;
				case 'southern_europe':
					$scope.southern_europe = territory;
					break;
				case 'north_africa':
					$scope.north_africa = territory;
					break;
				case 'egypt':
					$scope.egypt = territory;
					break;
				case 'east_africa':
					$scope.east_africa = territory;
					break;
				case 'central_africa':
					$scope.central_africa = territory;
					break;
				case 'south_africa':
					$scope.south_africa = territory;
					break;
				case 'madagascar':
					$scope.madagascar = territory;
					break;
				case 'ural':
					$scope.ural = territory;
					break;
				case 'siberia':
					$scope.siberia = territory;
					break;
				case 'yakutsk':
					$scope.yakutsk = territory;
					break;
				case 'kamchatka':
					$scope.kamchatka = territory;
					break;
				case 'irkutsk':
					$scope.irkutsk = territory;
					break;
				case 'mongolia':
					$scope.mongolia = territory;
					break;
				case 'japan':
					$scope.japan = territory;
					break;
				case 'afghanistan':
					$scope.afghanistan = territory;
					break;
				case 'china':
					$scope.china = territory;
					break;
				case 'middle_east':
					$scope.middle_east = territory;
					break;
				case 'india':
					$scope.india = territory;
					break;
				case 'southeast_asia':
					$scope.southeast_asia = territory;
					break;
				case 'indonesia':
					$scope.indonesia = territory;
					break;
				case 'guinea':
					$scope.guinea = territory;
					break;
				case 'western_australia':
					$scope.western_australia = territory;
					break;
				case 'eastern_australia':
					$scope.eastern_australia = territory;
					break;
			}
		});

	}

	function assignTroops(gameData) {
		$scope.addTroops = true;
		$scope.currentPlayerTurnId = gameData.playerOrder[0].playerId;
		gameMgmt.getPlayersOrder(gameData.id).then(function(playersOrder) {
			var newAction = {
				gameId: gameData.id,
				actionType: 'assigningTroops',
				playerId: playersOrder[0].playerId,
				completed: false
			};
			actionMgmt.createAction(newAction).then(function(newActionRes) {
				assignFirstTroops(playersOrder[0]);
			});
		});
	}

	function assignFirstTroops(player) {
		$scope.activePlayer = player;
		$scope.firstPlayerTroops = 10;
	}

	function assignTroop(playerId, territoryName) {
		var gameId = $scope.gameData.id;
		gameMgmt.getGame(gameId).then(function(gameData) {
console.log('gameData:');
console.log(gameData);
		});
	}

	function chooseRandomColor(gameData) {
		var thisRandomColor;
		if($scope.allColors.length > 1) {
			var rand = Math.random();
			rand *= $scope.allColors.length;
			rand = Math.floor(rand);
			thisRandomColor = $scope.allColors[rand];
			$scope.allColors.splice(rand, 1);
		} else {
			thisRandomColor = $scope.allColors[0];
		}
		shadeColor(thisRandomColor);
		return thisRandomColor;
	}

	function shadeColor(color) {
		switch(color) {
			case 'blue':
				$scope.blueAvailable = false;
				break;
			case 'green':
				$scope.greenAvailable = false;
				break;
			case 'purple':
				$scope.purpleAvailable = false;
				break;
			case 'red':
				$scope.redAvailable = false;
				break;
			case 'yellow':
				$scope.yellowAvailable = false;
				break;
			default:
		}
	}

	function getOrder(gameData) {
		var array = gameData.players;
		actionMgmt.getActionsByGameId(gameData.id).then(function(actionGameData) {
			actionGameData.forEach(function(actionData) {
				if(actionData.actionType === 'addingPlayers') {
					actionData.completed = true;
					actionMgmt.updateAction(actionData).then(function(updatedAction) {
					});
				}
			});
			var newAction = {
				gameId: gameData.id,
				actionType: 'orderingPlayers',
				playerId: gameData.gameCreator,
				completed: false
			};
			actionMgmt.createAction(newAction).then(function(newActionRes) {
				if(gameData.playerOrder) {
					return gameData.playerOrder;
				} else {
					if($scope.samDebug) {
						array = [
							{
								"playerId" : "58e17ca2a719ff42d05742d7",
//								"troopsToAssign" : 16,
							},
							{
								"playerId" : "58e17f7da719ff42d05742db",
//								"troopsToAssign" : 16,
							},
							{
								"playerId" : "58e17f6ea719ff42d05742da",
//								"troopsToAssign" : 17,
							},
							{
								"playerId" : "58e17f53a719ff42d05742d8",
//								"troopsToAssign" : 17,
							},
							{
								"playerId" : "58e17f63a719ff42d05742d9",
//								"troopsToAssign" : 17,
							}
						];
					} else {
						var currentIndex = array.length, temporaryValue, randomIndex;
			
						// While there remain elements to shuffle...
						while (0 !== currentIndex) {
			
							// Pick a remaining element...
							randomIndex = Math.floor(Math.random() * currentIndex);
							currentIndex -= 1;
			
							// And swap it with the current element.
							temporaryValue = array[currentIndex];
							array[currentIndex] = array[randomIndex];
							array[randomIndex] = temporaryValue;
						}
					}
//					array[0].troopsToAssign = 16;
//					array[1].troopsToAssign = 16;
//					array[2].troopsToAssign = 17;
//					array[3].troopsToAssign = 17;
//					array[4].troopsToAssign = 17;
		
					gameData.playerOrder = array;
					gameMgmt.updateGame(gameData).then(function(res) {
						array.forEach(function(playerObj) {
							playerMgmt.getPlayer(playerObj.playerId).then(function(playerData) {
								playerObj.fName = playerData.fName;
								playerObj.lName = playerData.lName;
								playerObj.username = playerData.username;
								playerObj.active = true;
							});
						});
						$scope.players = array;
						pickColors(res.data);
					});
				}
			});
		});

		return array;
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
