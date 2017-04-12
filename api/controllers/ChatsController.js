/**
 * ChatsController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

var serverError = 'An error occurred. Please try again later.';

module.exports = {
	byGameID: function(req, res) {
		var gameId = req.params.id;
		Chats.find({gameId: gameId})
		.sort({createdAt: 1})
		.limit(50)
		.then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Chats.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

