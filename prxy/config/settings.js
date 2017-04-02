var path = require('path');

module.exports = {
	proxy: {
		port: 3080,
	},

  domainToPort: {
    'casinocorruption.com': 2274,
    'themantisshrimp.com': 2583,
    'wyodraw.com': 3729,
    'wyodraw.net': 3729,
    'admin.ticketstycoon.com': 8492,
  },

	domainToDomain: {
    'ticketstycoon.com': 'https://ticketstycoon.com/app/',
    'www.ticketstycoon.com': 'https://ticketstycoon.com/app/'
	},
};

