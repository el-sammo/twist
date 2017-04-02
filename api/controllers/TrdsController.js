/**
 * TrdController
 *
 * @description :: Server-side logic for managing trds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  datatables: function(req, res) {
    var options = req.query;

    Trds.datatables(options).sort({name: 'asc'}).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  },

	toValidate: function(req, res) {
		var trId = req;
		Trds.find({id: trId}).then(function(result) {
//			res.send(result[0]);
			res.send(JSON.stringify(44));
		}).catch(function(err) {
      return ({error: 'Server error'});
      console.error(err);
      throw err;
		});
	},

	byDate: function(req, res) {
		Trds.find({raceDate: req.params.id}).sort({name: 'asc'}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	closeRace: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var customerId = rpPcs[2];
			if(trackId && raceNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return closeValidRace(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Close Race Data'}));
			}
		}
	},
	
	unCloseRace: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var customerId = rpPcs[2];
			if(trackId && raceNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return unCloseValidRace(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Close Race Data'}));
			}
		}
	},
	
	scratchEntry: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var entryNum = rpPcs[2];
			var customerId = rpPcs[3];
			if(trackId && raceNum && entryNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return scratchValidEntry(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Scratch Entry Data'}));
			}
		}
	},
	
	unScratchEntry: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var entryNum = rpPcs[2];
			var customerId = rpPcs[3];
			if(trackId && raceNum && entryNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return unScratchValidEntry(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Unscratch Entry Data'}));
			}
		}
	},
	
	favoriteEntry: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var entryNum = rpPcs[2];
			var customerId = rpPcs[3];
			if(trackId && raceNum && entryNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return favoriteValidEntry(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Favorite Entry Data'}));
			}
		}
	},
	
	unFavoriteEntry: function(req, res) {
		if(req.params.id) {
			var rpPcs = req.params.id.split('-');
			var trackId = rpPcs[0];
			var raceNum = rpPcs[1];
			var entryNum = rpPcs[2];
			var customerId = rpPcs[3];
			if(trackId && raceNum && entryNum && customerId === '5765aec37e7e6e33c9203f4d') {
				return unFavoriteValidEntry(req, res);
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid UnFavorite Entry Data'}));
			}
		}
	},
	
	score: function(req, res) {
		if(req.body && req.body.trdData && req.body.trdData.id && req.body.customerId && req.body.customerId === '5765aec37e7e6e33c9203f4d') {
			return scoreRace(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid Score Data'}));
		}
	}
	
};

function scoreRace(req, res, self) {
	var trdData = req.body.trdData;
	var trId = req.body.trId;
	var raceNum = req.body.raceNum;
	var finalRaceId = trId +'-'+ raceNum;
	var scoreData;
	trdData.races.forEach(function(race) {
		if(parseInt(race.number) == parseInt(raceNum)) {
			scoreData = race.score;
		}
	});
	return Trds.update({id: trdData.id}, {races: trdData.races}, false, false).then(function(scoredData) {
		var affectedCustomerIds = [];
		return TrdsService.getTournamentId(trdData.id).then(function(tournamentIdData) {
			affectedCustomerIds.push(tournamentIdData.tournamentId);
			return TrdsService.getAffectedWagers(finalRaceId).then(function(affectedWagers) {
				affectedWagers.forEach(function(wager) {
					if(affectedCustomerIds.indexOf(wager.customerId) < 0) {
						affectedCustomerIds.push(wager.customerId);
					}
					var result = parseInt(0);
					if(wager.wagerPool === 'Win') {
console.log('evaluating win');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
							}
						}
					}
					if(wager.wagerPool === 'Place') {
console.log('evaluating place');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wagerSelections.indexOf(scoreData.secondNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.secondNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
						}
					}
					if(wager.wagerPool === 'Show') {
console.log('evaluating show');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstShowPrice);
							}
							if(wagerSelections.indexOf(scoreData.secondNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.secondShowPrice);
							}
							if(wagerSelections.indexOf(scoreData.thirdNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.thirdShowPrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.secondNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.thirdNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.thirdShowPrice);
							}
						}
					}
					if(wager.wagerPool === 'Exacta') {
console.log('evaluating exacta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var firstCorrect = false;
						var secondCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								result += ((wager.wagerAmount / 2) * scoreData.exactaPrice);
console.log('result: '+result);
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Trifecta') {
console.log('evaluating trifecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									result += ((wager.wagerAmount / 2) * scoreData.trifectaPrice);
console.log('result: '+result);
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Superfecta') {
console.log('evaluating superecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[3];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fourthCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									if(fourthRunners.length > 1) {
										var fourthRunnersPcs = fourthRunners.split(',');
										if(fourthRunnersPcs.indexOf(scoreData.fourthNumber) > -1) {
											fourthCorrect = true;
										}
									} else {
										if(fourthRunners.toString() === scoreData.fourthNumber) {
											fourthCorrect = true;
										}
									}
									if(fourthCorrect) {
										result += ((wager.wagerAmount / 2) * scoreData.superfectaPrice);
console.log('result: '+result);
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Pentafecta') {
console.log('evaluating pentafecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[3];
						var fifthRunners = wsPcs[4];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fifthCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									if(fourthRunners.length > 1) {
										var fourthRunnersPcs = fourthRunners.split(',');
										if(fourthRunnersPcs.indexOf(scoreData.fourthNumber) > -1) {
											fourthCorrect = true;
										}
									} else {
										if(fourthRunners.toString() === scoreData.fourthNumber) {
											fourthCorrect = true;
										}
									}
									if(fourthCorrect) {
										if(fifthRunners.length > 1) {
											var fifthRunnersPcs = fifthRunners.split(',');
											if(fifthRunnersPcs.indexOf(scoreData.fifthNumber) > -1) {
												fifthCorrect = true;
											}
										} else {
											if(fifthRunners.toString() === scoreData.fifthNumber) {
												fifthCorrect = true;
											}
										}
										if(fifthCorrect) {
											result += ((wager.wagerAmount / 2) * scoreData.pentafectaPrice);
console.log('result: '+result);
										} else {
console.log('fifth NOT correct');
										}
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Daily Double') {
console.log('evaluating dd');
						if(scoreData.dailyDouble) {
							var wsPcs = wager.wagerSelections.split(' / ');
							var ddPcs = scoreData.dailyDouble.split('/');
							var firstRunners = wsPcs[0];
							var secondRunners = wsPcs[1];
							var firstWinners = ddPcs[0];
							var secondWinners = ddPcs[1];
							var firstCorrect = false;
							var secondCorrect = false;
							var firstRunnersArray = firstRunners.split(',');
							var secondRunnersArray = secondRunners.split(',');
							var firstWinnersArray = firstWinners.split(',');
							var secondWinnersArray = secondWinners.split(',');
							firstWinnersArray.forEach(function(firstWinner) {
								firstRunnersArray.forEach(function(firstRunner) {
									if(firstWinner.toString() === firstRunner.toString()) {
										firstCorrect = true;
									}
								});
							});
							if(firstCorrect) {
								secondWinnersArray.forEach(function(secondWinner) {
									secondRunnersArray.forEach(function(secondRunner) {
										if(secondWinner.toString() === secondRunner.toString()) {
											secondCorrect = true;
										}
									});
								});
								if(secondCorrect) {
									result += ((wager.wagerAmount / 2) * scoreData.dailyDoublePrice);
	console.log('result: '+result);
								} else {
	console.log('second NOT correct');
								}
							} else {
	console.log('first NOT correct');
							}
						} else {
// TODO debug this
console.log('scoreData.dailyDouble expected but not found');
						}
					}
					if(wager.wagerPool === 'Pick 3') {
console.log('evaluating p3');
						if(scoreData.pick3) {
							var wsPcs = wager.wagerSelections.split(' / ');
							var p3Pcs = scoreData.pick3.split('/');
							var firstRunners = wsPcs[0];
							var secondRunners = wsPcs[1];
							var thirdRunners = wsPcs[2];
							var firstWinners = p3Pcs[0];
							var secondWinners = p3Pcs[1];
							var thirdWinners = p3Pcs[2];
							var firstCorrect = false;
							var secondCorrect = false;
							var thirdCorrect = false;
							var firstRunnersArray = firstRunners.split(',');
							var secondRunnersArray = secondRunners.split(',');
							var thirdRunnersArray = thirdRunners.split(',');
							var firstWinnersArray = firstWinners.split(',');
							var secondWinnersArray = secondWinners.split(',');
							var thirdWinnersArray = thirdWinners.split(',');
							firstWinnersArray.forEach(function(firstWinner) {
								firstRunnersArray.forEach(function(firstRunner) {
									if(firstWinner.toString() === firstRunner.toString()) {
										firstCorrect = true;
									}
								});
							});
							if(firstCorrect) {
								secondWinnersArray.forEach(function(secondWinner) {
									secondRunnersArray.forEach(function(secondRunner) {
										if(secondWinner.toString() === secondRunner.toString()) {
											secondCorrect = true;
										}
									});
								});
								if(secondCorrect) {
									thirdWinnersArray.forEach(function(thirdWinner) {
										thirdRunnersArray.forEach(function(thirdRunner) {
											if(thirdWinner.toString() === thirdRunner.toString()) {
												thirdCorrect = true;
											}
										});
									});
									if(thirdCorrect) {
										result += ((wager.wagerAmount / 2) * scoreData.pick3Price);
console.log('result: '+result);
									} else {
console.log('third NOT correct');
									}
								} else {
console.log('second NOT correct');
								}
							} else {
console.log('first NOT correct');
							}
						} else {
// TODO debug this
console.log('scoreData.pick3 expected but not found');
						}
					}
					if(wager.wagerPool === 'Pick 4') {
console.log('evaluating p4');
						if(scoreData.pick4) {
							var wsPcs = wager.wagerSelections.split(' / ');
							var p4Pcs = scoreData.pick4.split('/');
							var firstRunners = wsPcs[0];
							var secondRunners = wsPcs[1];
							var thirdRunners = wsPcs[2];
							var fourthRunners = wsPcs[2];
							var firstWinners = p4Pcs[0];
							var secondWinners = p4Pcs[1];
							var thirdWinners = p4Pcs[2];
							var fourthWinners = p4Pcs[2];
							var firstCorrect = false;
							var secondCorrect = false;
							var thirdCorrect = false;
							var fourthCorrect = false;
							var firstRunnersArray = firstRunners.split(',');
							var secondRunnersArray = secondRunners.split(',');
							var thirdRunnersArray = thirdRunners.split(',');
							var fourthRunnersArray = fourthRunners.split(',');
							var firstWinnersArray = firstWinners.split(',');
							var secondWinnersArray = secondWinners.split(',');
							var thirdWinnersArray = thirdWinners.split(',');
							var fourthWinnersArray = fourthWinners.split(',');
							firstWinnersArray.forEach(function(firstWinner) {
								firstRunnersArray.forEach(function(firstRunner) {
									if(firstWinner.toString() === firstRunner.toString()) {
										firstCorrect = true;
									}
								});
							});
							if(firstCorrect) {
								secondWinnersArray.forEach(function(secondWinner) {
									secondRunnersArray.forEach(function(secondRunner) {
										if(secondWinner.toString() === secondRunner.toString()) {
											secondCorrect = true;
										}
									});
								});
								if(secondCorrect) {
									thirdWinnersArray.forEach(function(thirdWinner) {
										thirdRunnersArray.forEach(function(thirdRunner) {
											if(thirdWinner.toString() === thirdRunner.toString()) {
												thirdCorrect = true;
											}
										});
									});
									if(thirdCorrect) {
										fourthWinnersArray.forEach(function(fourthWinner) {
											fourthRunnersArray.forEach(function(fourthRunner) {
												if(fourthWinner.toString() === fourthRunner.toString()) {
													fourthCorrect = true;
												}
											});
										});
										if(fourthCorrect) {
											result += ((wager.wagerAmount / 2) * scoreData.pick4Price);
console.log('result: '+result);
										} else {
console.log('fourth NOT correct');
										}
									} else {
console.log('third NOT correct');
									}
								} else {
console.log('second NOT correct');
								}
							} else {
console.log('first NOT correct');
							}
						} else {
// TODO debug this
console.log('scoreData.pick4 expected but not found');
						}
					}
					if(wager.wagerPool === 'Pick 5') {
console.log('evaluating p5');
						if(scoreData.pick5) {
							var wsPcs = wager.wagerSelections.split(' / ');
							var p5Pcs = scoreData.pick5.split('/');
							var firstRunners = wsPcs[0];
							var secondRunners = wsPcs[1];
							var thirdRunners = wsPcs[2];
							var fourthRunners = wsPcs[2];
							var fifthRunners = wsPcs[2];
							var firstWinners = p5Pcs[0];
							var secondWinners = p5Pcs[1];
							var thirdWinners = p5Pcs[2];
							var fourthWinners = p5Pcs[2];
							var fifthWinners = p5Pcs[2];
							var firstCorrect = false;
							var secondCorrect = false;
							var thirdCorrect = false;
							var fourthCorrect = false;
							var fifthCorrect = false;
							var firstRunnersArray = firstRunners.split(',');
							var secondRunnersArray = secondRunners.split(',');
							var thirdRunnersArray = thirdRunners.split(',');
							var fourthRunnersArray = fourthRunners.split(',');
							var fifthRunnersArray = fifthRunners.split(',');
							var firstWinnersArray = firstWinners.split(',');
							var secondWinnersArray = secondWinners.split(',');
							var thirdWinnersArray = thirdWinners.split(',');
							var fourthWinnersArray = fourthWinners.split(',');
							var fifthWinnersArray = fifthWinners.split(',');
							firstWinnersArray.forEach(function(firstWinner) {
								firstRunnersArray.forEach(function(firstRunner) {
									if(firstWinner.toString() === firstRunner.toString()) {
										firstCorrect = true;
									}
								});
							});
							if(firstCorrect) {
								secondWinnersArray.forEach(function(secondWinner) {
									secondRunnersArray.forEach(function(secondRunner) {
										if(secondWinner.toString() === secondRunner.toString()) {
											secondCorrect = true;
										}
									});
								});
								if(secondCorrect) {
									thirdWinnersArray.forEach(function(thirdWinner) {
										thirdRunnersArray.forEach(function(thirdRunner) {
											if(thirdWinner.toString() === thirdRunner.toString()) {
												thirdCorrect = true;
											}
										});
									});
									if(thirdCorrect) {
										fourthWinnersArray.forEach(function(fourthWinner) {
											fourthRunnersArray.forEach(function(fourthRunner) {
												if(fourthWinner.toString() === fourthRunner.toString()) {
													fourthCorrect = true;
												}
											});
										});
										if(fourthCorrect) {
											fifthWinnersArray.forEach(function(fifthWinner) {
												fifthRunnersArray.forEach(function(fifthRunner) {
													if(fifthWinner.toString() === fifthRunner.toString()) {
														fifthCorrect = true;
													}
												});
											});
											if(fifthCorrect) {
												result += ((wager.wagerAmount / 2) * scoreData.pick5Price);
console.log('result: '+result);
											} else {
console.log('fifth NOT correct');
											}
										} else {
console.log('fourth NOT correct');
										}
									} else {
console.log('third NOT correct');
									}
								} else {
console.log('second NOT correct');
								}
							} else {
console.log('first NOT correct');
							}
						}
					} else {
// TODO debug this
console.log('score.pick5 expected but not found');
					}
// TODO P6, P7, P8, P9, P10
					TrdsService.scoreWager(wager.id, result).then(function(updateWagerResponse) {
						if(!updateWagerResponse.success) {
console.log('updateWagerResponse error:');
console.log(updateWagerResponse.err);
						}
					});
				});
				return res.send(JSON.stringify({success: true, acIds: affectedCustomerIds}));
			});
		});
		
	//	res.send(JSON.stringify(results));
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function closeValidRace(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				race.closed = true;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function unCloseValidRace(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				race.closed = false;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function scratchValidEntry(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	var entryNum = rpPcs[2];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				updatedEntries = [];
				race.entries.forEach(function(entry) {
					if(entry.number.toString() === entryNum.toString()) {
						entry.active = false;
					}
					updatedEntries.push(entry);
				});
				race.entries = updatedEntries;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function unScratchValidEntry(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	var entryNum = rpPcs[2];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				updatedEntries = [];
				race.entries.forEach(function(entry) {
					if(entry.number.toString() === entryNum.toString()) {
						entry.active = true;
					}
					updatedEntries.push(entry);
				});
				race.entries = updatedEntries;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function favoriteValidEntry(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	var entryNum = rpPcs[2];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				updatedEntries = [];
				race.entries.forEach(function(entry) {
					if(entry.number.toString() === entryNum.toString()) {
						entry.favorite = true;
					}
					updatedEntries.push(entry);
				});
				race.entries = updatedEntries;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}

function unFavoriteValidEntry(req, res, self) {
	var rpPcs = req.params.id.split('-');
	var trackId = rpPcs[0];
	var raceNum = rpPcs[1];
	var entryNum = rpPcs[2];
	return Trds.find({
		id: trackId
	}).then(function(trdData) {
		var trackData = trdData[0];
		var updatedRaces = [];
		trackData.races.forEach(function(race) {
			if(race.number == raceNum) {
				updatedEntries = [];
				race.entries.forEach(function(entry) {
					if(entry.number.toString() === entryNum.toString()) {
						entry.favorite = false;
					}
					updatedEntries.push(entry);
				});
				race.entries = updatedEntries;
			}
			updatedRaces.push(race);
		});
		return Trds.update(
			{id: trackData.id}, 
			{races: updatedRaces},
			false,
			false
		).then(function(updatedData) {
			return res.send(JSON.stringify({success: true, updatedData: updatedData}));
		});
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}



