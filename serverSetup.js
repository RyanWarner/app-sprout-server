'use strict';

var express  = require('express');
var mongoose = require('mongoose');
var path     = require('path');
var fs       = require('fs');
var config   = require('./server/config/config');


// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


// Expose promise
module.exports = function() {
	var promise = new mongoose.Promise();


	// Grab all the models.

	var modelsPath = path.join(__dirname, 'server/models');

	fs.readdirSync(modelsPath).forEach(function(file) {
		if(/(.*)\.(js$|coffee$)/.test(file)) {
			require( modelsPath + '/' + file);
		}
	});



	// Configure Express

	var app = express();
	
	require('./server/config/express')(app).then(function() {
		// Routing
		require('./server/routes')(app);

		// Connect to the database.
		mongoose.connection.once('connected', function() {
			console.log('Mongoose connected.');

			promise.fulfill(app);
		});
		
		mongoose.connection.on ('error', function(err) {
			console.log('Mongoose connection error:');
			console.log(err);
		});
		
		mongoose.connect(config.mongo.uri, config.mongo.options);
	});

	console.log('Express configured');



	// Passport Configuration

	var passport = require('./server/config/passport');
	console.log('Passport configured.');


	return promise;
};
