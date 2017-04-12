/**
* Chats.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
		gameId: {
      type: 'string',
      required: true
		},
    playerId: {
      type: 'string',
      required: true
		},
    msg: {
      type: 'string',
      required: true
		},
    username: {
      type: 'string',
      required: true
		}
  }

};

tablize(module.exports);

