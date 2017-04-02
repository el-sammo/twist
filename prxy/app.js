
///
// This does not support SSL inherently.  To use SSL, configure
// the proxy (socat) pointing to this service for SSL.
//
// @see http://www.dest-unreach.org/socat/doc/socat-openssltunnel.html
// @see https://www.blackbytes.info/2012/07/socat-cheatsheet/
///

///
// Dependencies
///

// Filesystem utilities
var fs = require('fs');

// querystring utility
var querystring = require('querystring');

// HTTP/HTTPS web server libraries
var protocols = {
  'http': require('http'),
  'https': require('https'),
};

// HTTP proxy
var httpProxy = require('http-proxy');

// Lodash - Utility belt
var _ = require('lodash');

// Promises implementation
var Promise = require('bluebird');

// Logging
var bunyan = require('bunyan');

// Local settings file
var settings = require('./config/settings');

// Logging configuration
var logConfig = require('./config/logging');


///
// Setup
///

// Set up logging
var log = bunyan.createLogger(logConfig);
log.debug('Logging initialized');
log.trace(
  'For best logging results, pipe output to the bunyan command-line ' +
  'utility (Installation: `npm install -g bunyan`).'
);
log.trace(
  'Logging verbosity and other logging options can be changed in ' +
  'config/logging.js'
);

// Set up proxy configuration
log.debug('Setting up proxy configuration...');
var domainToPort = settings.domainToPort;
var domainToDomain = settings.domainToDomain;

var protocol = protocols.http;

// Create http(s) server
log.debug('Creating http(s) server....');
var server = protocol.createServer(handleRequest);

// Create proxy server
log.debug('Creating proxy server....');
var proxy = httpProxy.createProxyServer();

// Start proxy listening on configured port
server.listen(settings.proxy.port, function() {
	log.info('Domain proxy listening on port ' + settings.proxy.port);
});


///
// Request controller
///

/**
 * For every request, proxies based on domain name.
 */
function handleRequest(req, res) {
  log.info({url: req.url}, 'Proxying request');
console.log('domainToDomain[req.headers.host]:');
console.log(domainToDomain[req.headers.host]);

	if(domainToDomain[req.headers.host]) {
		res.writeHead(302, {
			Location: (
				domainToDomain[req.headers.host] + 
				querystring.stringify({from: req.headers.host})
			)
		});
		res.end();
		return;
	}

	var port = domainToPort[req.headers.host];

	if(_.isUndefined(port)) {
		log.trace('Request for invalid domain/port: ' + req.headers.host);
		res.statusCode = 404;
		res.statusMessage = 'Not Found';
		res.end();
		return;
	}

	log.trace(
		'Proxying request for domain ' + req.headers.host + ' to port ' +
		port
	);

	// Proxy automatically figures everything else out based on the
	// request it gets sent, proxying to given host on looked-up port
	return proxy.web(req, res, {
		target: 'http://' + req.headers.host + ':' + port,
	});
}
