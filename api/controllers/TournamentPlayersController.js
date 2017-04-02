/**
 * TournamentPlayersController
 *
 * @description :: Server-side logic for managing tournament players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var Promise = require('bluebird');

var serverError = 'An error occurred. Please try again later.';

var httpAdapter = 'http';
var extra = {};

module.exports = {
	byPlayerId: function(req, res) {
		var reqPcs = req.params.id.split('-');
		var playerId = reqPcs[0];
		TournamentPlayers.find({playerId: playerId}).sort({
			name: 'asc', entryFee: 'asc'
		}).then(function(tournaments) {
			res.send(JSON.stringify(tournaments));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byTournamentId: function(req, res) {
		var reqPcs = req.params.id.split('-');
		var tournamentId = reqPcs[0];
		TournamentPlayers.find({tournamentId: tournamentId}).sort({
			name: 'asc', entryFee: 'asc'
		}).then(function(tournamentPlayers) {
			res.send(JSON.stringify(tournamentPlayers));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    TournamentPlayers.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

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

