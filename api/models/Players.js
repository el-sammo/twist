/**
* Customers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    fName: {
      type: 'string',
      required: true
		},
    lName: {
      type: 'string',
      required: true
		},
    email: {
      type: 'string',
      required: true
		},
    phone: {
      type: 'integer',
      required: false
		},
    addressNumber: {
      type: 'string',
      required: false
		},
    addressApt: {
      type: 'string',
      required: false
		},
    addressStreet: {
      type: 'string',
      required: false
		},
    addressCity: {
      type: 'string',
      required: false
		},
    addressState: {
      type: 'string',
      required: false
		},
    addressZip: {
      type: 'string',
      required: false
		},
    uscf: {
      type: 'integer',
      required: false
		},
    uscfExpiry: {
      type: 'integer',
      required: false
		},
    uscfState: {
      type: 'string',
      required: false
		},
    uscfRating: {
      type: 'integer',
      required: false
		},
    fide: {
      type: 'integer',
      required: false
		},
    fideExpiry: {
      type: 'integer',
      required: false
		},
    fideRating: {
      type: 'integer',
      required: false
		},
    ccomUsername: {
      type: 'string',
      required: true
		},
    username: {
      type: 'string',
      required: true
		},
    password: {
      type: 'string',
      required: true
		},
    balance: {
      type: 'float',
      required: false
		}
  },

  beforeCreate: function(attrs, next) {
    var onSalt = bcrypt.genSaltAsync(10);

    onSalt.then(function(salt) {
      var onHash = bcrypt.hashAsync(attrs.password, salt);
      onHash.then(function(hash) {
        attrs.password = hash;
        next();

      }).catch(function(err) {
        return next(err);
      });

    }).catch(function(err) {
      return next(err);
    });
  }

};

tablize(module.exports);

