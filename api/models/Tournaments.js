/**
* Tournaments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
		},
    maxEntries: {
      type: 'integer',
      required: true
		},
		variant: {
			type: 'string',
			required: true
		},
		timeControl: {
			type: 'string',
			required: true
		},
    tournyDate: {
      type: 'integer',
      required: true
		},
    registrationOpens: {
      type: 'integer',
      required: true
		},
    startTime: {
      type: 'integer',
      required: true
		},
    entryFee: {
      type: 'float',
      required: true
		},
    houseFee: {
      type: 'float',
      required: true
		},
    status: {
      type: 'string',
      required: true
		},
    closed: {
      type: 'boolean',
      required: true
		},
    finalStandings: {
      type: 'array',
      required: false
		}
  }

};

tablize(module.exports);

