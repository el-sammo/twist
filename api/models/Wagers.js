/**
* Wagers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    trackRaceId: {
      type: 'string',
      required: true
		},
    finalRaceId: {
      type: 'string',
      required: true
		},
    customerId: {
      type: 'string',
      required: true
		},
    wagerPlacedAt: {
      type: 'integer',
      required: true
		}
  }

};

tablize(module.exports);

