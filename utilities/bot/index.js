
var rp = require('request-promise');
var cheerio = require('cheerio');

var url = 'http://www.google.com';
var domain = parseDomain(url);

// first check existing data/media?

// we'll assume no existing or we don't want to check

var options = {
	uri: url,
	headers: {
		'Upgrade-Insecure-Requests': 1,
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
	},
	json: true,
	gzip: true
};

rp(options).then(function(data) {
	$ = cheerio.load(data);
	console.log($('title').text());
	if(($('link').attr('rel')).toLowerCase() === 'shortcut icon') {
		var href = $('link').attr('href');
		if(href.indexOf(domain) > -1) {
			console.log(href);
		} else {
			if(href[0] === '/') {
				href = domain + href;
				console.log(href);
			} else {
				href = domain + '/' + href;
				console.log(href);
			}
		}
	}
});

function parseDomain(url) {
	if(url.indexOf('://') > -1) {
		var httpPcs = url.split('://');
		url = httpPcs[1];
	}
	if(url.indexOf('/') > -1) {
		var slashPcs = url.split('/');
		url = slashPcs[0];
	}
	if(url.indexOf(':') > -1) {
		var colonPcs = url.split(':');
		url = colonPcs[0];
	}
	return url;
};
