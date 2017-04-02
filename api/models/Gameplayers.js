/**
 * Gameplayers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
    territories: {
      type: 'array',
      required: true
		},
    color: {
      type: 'string',
      required: true
		},
    turnOrder: {
      type: 'integer',
      required: true
		},
    protections: {
      type: 'array',
      required: true
		}
  }
};

tablize(module.exports);
