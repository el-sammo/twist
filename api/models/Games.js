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
		players: {
      type: 'array',
      required: false
		},
    territories: {
      type: 'array',
      required: false
		},
    assignType: {
      type: 'string',
      required: false
		},
    awardType: {
      type: 'string',
      required: false
		},
    started: {
      type: 'boolean',
      required: false
		}
  }

};

tablize(module.exports);

