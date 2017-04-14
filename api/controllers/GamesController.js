/**
 * GamesController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

var serverError = 'An error occurred. Please try again later.';

module.exports = {
	createNewGame: function(req, res) {
		var newGameData = req.body;
		// 42 territories
		newGameData.territories = [
			{
				name: 'alaska'
			},
			{
				name: 'northwest_territory'
			},
			{
				name: 'greenland'
			},
			{
				name: 'alberta'
			},
			{
				name: 'ontario'
			},
			{
				name: 'quebec'
			},
			{
				name: 'western_us'
			},
			{
				name: 'eastern_us'
			},
			{
				name: 'central_america'
			},
			{
				name: 'venezuela'
			},
			{
				name: 'peru'
			},
			{
				name: 'brazil'
			},
			{
				name: 'argentina'
			},
			{
				name: 'iceland'
			},
			{
				name: 'scandinavia'
			},
			{
				name: 'russia'
			},
			{
				name: 'great_britain'
			},
			{
				name: 'northern_europe'
			},
			{
				name: 'western_europe'
			},
			{
				name: 'southern_europe'
			},
			{
				name: 'north_africa'
			},
			{
				name: 'egypt'
			},
			{
				name: 'east_africa'
			},
			{
				name: 'central_africa'
			},
			{
				name: 'south_africa'
			},
			{
				name: 'madagascar'
			},
			{
				name: 'ural'
			},
			{
				name: 'siberia'
			},
			{
				name: 'yakutsk'
			},
			{
				name: 'kamchatka'
			},
			{
				name: 'irkutsk'
			},
			{
				name: 'mongolia'
			},
			{
				name: 'japan'
			},
			{
				name: 'afghanistan'
			},
			{
				name: 'china'
			},
			{
				name: 'middle_east'
			},
			{
				name: 'india'
			},
			{
				name: 'southeast_asia'
			},
			{
				name: 'indonesia'
			},
			{
				name: 'guinea'
			},
			{
				name: 'western_australia'
			},
			{
				name: 'eastern_australia'
			}
		];
		newGameData.started = false;
		Games.create(newGameData).then(function(gameData) {
			res.send(JSON.stringify(gameData));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},

	addCPUPlayers: function(req, res) {
		var cpuPlayers = [
			'58e17f53a719ff42d05742d8',
			'58e17f63a719ff42d05742d9',
			'58e17f6ea719ff42d05742da',
			'58e17f7da719ff42d05742db',
			'58e17f89a719ff42d05742dc'
		];
		Games.find({id: req.params.id}).then(function(results) {
			if(results[0].players && results[0].players.length < 5) {
				var playersNeeded = 5 - results[0].players.length;
				while(playersNeeded > 0) {
					results[0].players.push({playerId: cpuPlayers[playersNeeded - 1]});
					playersNeeded --;
				}
			}
			res.send(JSON.stringify(results[0]));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	getRandomTerritories: function(req, res) {
		Games.find({id: req.params.id}).then(function(results) {
			var array = results[0].territories;
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

			res.send(JSON.stringify(array));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	getAvailGames: function(req, res) {
		Games.find({started: false})
		.sort({createdAt: 1})
		.then(function(results) {
			var gamesToJoin = [];
			results.forEach(function(game) {
				if(game.players.length < 5) {
					gamesToJoin.push(game);
				}
			});
			res.send(JSON.stringify(gamesToJoin));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byTournamentId: function(req, res) {
		Games.find({tournamentId: req.params.id}).sort({
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byWhitePlayerId: function(req, res) {
		Games.find({whitePlayerId: req.params.id}).sort({
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byBlackPlayerId: function(req, res) {
		Games.find({blackPlayerId: req.params.id}).sort({
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byVariant: function(req, res) {
		Games.find({variant: req.params.id}).sort({
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Games.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

