/**
 * TournamentsController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var Promise = require('bluebird');

var serverError = 'An error occurred. Please try again later.';

var httpAdapter = 'http';
var extra = {};

module.exports = {
	byName: function(req, res) {
		Tournaments.find({name: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byEntryFee: function(req, res) {
		Tournaments.find({entryFee: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byPlayerId: function(req, res) {
		var reqPcs = req.params.id.split('-');
		var playerId = reqPcs[0];
		var today = reqPcs[1];
		Tournaments.find({tournyDate: today}).sort({
			name: 'asc', entryFee: 'asc'
		}).then(function(tournaments) {
			var playerTournaments = [];
			tournaments.forEach(function(tournament) {
				tournament.players.forEach(function(player) {
					if(player.playerId === playerId) {
						playerTournaments.push(tournament);
					}
				});
			});
			res.send(JSON.stringify(playerTournaments));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byDate: function(req, res) {
		Tournaments.find({tournyDate: req.params.id}).sort({
			startTime: 'asc', name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	resultsByPlayerId: function(req, res) {
		if(req.params.id) {
			return getResultsByPlayerId(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid resultsByPlayerId data'}));
		}
	},
	
	closeTournament: function(req, res) {
		if(req.params.id) {
			return closeValidTournament(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid tournament data'}));
		}
	},
	
	unCloseTournament: function(req, res) {
		if(req.params.id) {
			return unCloseValidTournament(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid tournament data'}));
		}
	},
	
	register: function(req, res) {
		var rpiPcs = req.params.id.split('-');
		if(rpiPcs.length > 1) {
			return tournamentRegister(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid registration data'}));
		}
	},
	
	unRegister: function(req, res) {
		var rpiPcs = req.params.id.split('-');
		if(rpiPcs.length > 1) {
			return tournamentUnregister(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid unregistration data'}));
		}
	},
	
	createCustomTournament: function(req, res) {
		if(req.body) {
			var missingPcs = [];
			if(!req.body.name) {
				missingPcs.push('name');
			}
			if(!req.body.maxEntries) {
				missingPcs.push('maxEntries');
			}
			if(!req.body.minEntries) {
				missingPcs.push('minEntries');
			}
			if(!req.body.variant) {
				missingPcs.push('variant');
			}
			if(!req.body.timeControl) {
				missingPcs.push('timeControl');
			}
			if(!req.body.registrationOpens) {
				missingPcs.push('registrationOpens');
			}
			if(!req.body.startTime) {
				missingPcs.push('startTime');
			}
			if(!req.body.entryFee) {
				missingPcs.push('entryFee');
			}
			if(!req.body.houseFee) {
				missingPcs.push('houseFee');
			}
			if(!req.body.status) {
				missingPcs.push('status');
			}
			if(missingPcs.length) {
console.log(' ');
console.log('missingPcs:');
console.log(missingPcs);
			}
			return createValidCustomTournament(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid createCustomTournament data'}));
		}
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Tournaments.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

function tournamentRegister(req, res, self) {
	var rpiPcs = req.params.id.split('-');
	var tournamentId = rpiPcs[0];
	var playerId = rpiPcs[1];
	return Tournaments.find({id: tournamentId}).then(function(results) {
		var tournamentData = results[0];
		var tournamentMax;
		if(tournamentData.max == 999999) {
			tournamentMax = 999999999999;
		} else {
			tournamentMax = tournamentData.maxEntries;
		}

		if(tournamentData.closed) {
			return res.send(JSON.stringify({success: false, failMsg: 'Closed'}));
		}
// find tournament in the tournamentPlayers collection and then see if this player is already registered
		var playerFound = false;
		tournamentData.players.forEach(function(player) {
			if(player === playerId) {
				playerFound = true;
			}
		});
		if(playerFound) {
			return res.send(JSON.stringify({success: false, failMsg: 'Already Registered'}));
		}
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.houseFee));
// find tournament in the tournamentPlayers collection and then see if the tournament already has enough players (max)
		if(tournamentData.players.length < tournamentMax) {
			return TournamentsService.getPlayerBalance(playerId).then(function(balanceData) {
				if(balanceData.balance >= totalFee) {
					return TournamentsService.updatePlayerBalance(playerId, balanceData.balance, totalFee, 'subtract').then(function(playerData) {
						if(playerData.success) {
							tournamentData.players.push(playerId);
							return Tournaments.update({id: tournamentData.id}, {players: tournamentData.players}, false, false).then(function(result) {
								return TournamentsService.addPlayer(tournamentData.id, playerId, tournamentData.credits).then(function(tsData) {
									res.send(JSON.stringify(tsData));
								});
							}).catch(function(err) {
								res.json({error: 'Server error'}, 500);
								console.error(err);
								throw err;
							});
						}
						return res.send(JSON.stringify({success: false, failMsg: 'Player Balance Error'}));
					}).catch(function(err) {
						res.json({error: 'Server error'}, 500);
						console.error(err);
						throw err;
					});	
				} else {
					return res.send(JSON.stringify({success: false, failMsg: 'Insufficient Funds '+totalFee}));
				}
			}).catch(function(err) {
				res.json({error: 'Server error'}, 500);
				console.error(err);
				throw err;
			});
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Full'}));
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}
function tournamentUnregister(req, res, self) {
	var rpiPcs = req.params.id.split('-');
	var tournamentId = rpiPcs[0];
	var playerId = rpiPcs[1];
	return Tournaments.find({id: tournamentId}).then(function(results) {
		var tournamentData = results[0];
		if(tournamentData.closed) {
			return res.send(JSON.stringify({success: false, failMsg: 'Closed'}));
		}
		var playerFound = false;
		tournamentData.players.forEach(function(player) {
			if(player === playerId) {
				playerFound = true;
			}
		});
		if(!playerFound) {
			return res.send(JSON.stringify({success: false, failMsg: 'Not Registered'}));
		}
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.siteFee));
		return TournamentsService.getPlayerBalance(playerId).then(function(balanceData) {
			return TournamentsService.updatePlayerBalance(playerId, balanceData.balance, totalFee, 'add').then(function(playerData) {
				if(playerData.success) {
					var newPlayers = [];
					tournamentData.players.forEach(function(player) {
						if(player !== playerId) {
							newPlayers.push(player);
						}
					});
					return Tournaments.update({id: tournamentData.id}, {players: newPlayers}, false, false).then(function(result) {
						return TournamentsService.removePlayer(tournamentData.id, playerId).then(function(tsData) {
							res.send(JSON.stringify(tsData));
						});
					}).catch(function(err) {
						res.json({error: 'Server error'}, 500);
						console.error(err);
						throw err;
					});
				}
				return res.send(JSON.stringify({success: false, failMsg: 'Player Balance Error'}));
			}).catch(function(err) {
				res.json({error: 'Server error'}, 500);
				console.error(err);
				throw err;
			});	
		}).catch(function(err) {
			res.json({error: 'Server error'}, 500);
			console.error(err);
			throw err;
		});
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}


function getResultsByPlayerId(req, res, self) {
	var playerId = req.params.id;
	return TournamentsService.getTournamentResultsByPlayerId(playerId).then(function(gtrResponse) {
		if(gtrResponse.success) {
			res.send(JSON.stringify(gtrResponse.resultsData));
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}


function closeValidTournament(req, res, self) {
	var tournamentId = req.params.id;
	return Tournaments.update(
		{id: tournamentId},
		{closed: true},
		false,
		false
	).then(function(updateResponse) {
		res.send(JSON.stringify(updateResponse[0]));
	}).catch(function(err) {
		return {error: 'Server error'};
		console.error(err);
		throw err;
	});
}

function unCloseValidTournament(req, res, self) {
	var tournamentId = req.params.id;
	return Tournaments.update(
		{id: tournamentId},
		{closed: false},
		false,
		false
	).then(function(updateResponse) {
		res.send(JSON.stringify(updateResponse[0]));
	}).catch(function(err) {
		return {error: 'Server error'};
		console.error(err);
		throw err;
	});
}

function createValidCustomTournament(req, res, self) {
	return TournamentsService.createCustomTournament(req.body).then(function(ictResponse) {
		if(ictResponse.success) {
			return TournamentsService.getCustomerBalance(req.body.customers[0]).then(function(balanceData) {
				var dTotal = parseFloat(req.body.entryFee + req.body.siteFee);
				if(balanceData.balance >= dTotal) {
					return TournamentsService.updateCustomerBalance(req.body.customers[0], balanceData.balance, dTotal, 'subtract').then(function(customerData) {
						if(customerData.success) {
							res.send({success: true, tournamentData: ictResponse.tournamentData});
						} else {
console.log(' ');
console.log('error updating customer balance in createValidCustomTournament-TournamentsService.updateCustomerBalance');
console.log(' ');
							res.send({success: false});
						}
					});
				} else {
console.log(' ');
console.log('customer balance('+balanceData.balance+') less than dTotal ('+dTotal+') - this should ***NEVER*** happen');
console.log(' ');
					res.send({success: false});
				}
			});
		} else {
			res.send({success: false});
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
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

