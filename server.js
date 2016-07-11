'use strict';

var express  = require('express');
var mongoose = require('mongoose');
var http     = require('http');
var app      = express();

require('./serverSetup.js')().then(function(app) {
	var server = http.createServer(app);

	server.on('listening', function() {
		console.log('yes, server listening 9000');
	});

	server.listen(9000);
	console.log('Is the server listening on port 9000?');
});
