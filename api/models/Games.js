/**
* Games.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    player1Id: {
      type: 'string',
      required: true
		},
    player2Id: {
      type: 'string',
      required: false
		},
    player3Id: {
      type: 'string',
      required: false
		},
    player4Id: {
      type: 'string',
      required: false
		},
    player5Id: {
      type: 'string',
      required: false
		},
    started: {
      type: 'boolean',
      required: true
		}
  }

};

tablize(module.exports);

