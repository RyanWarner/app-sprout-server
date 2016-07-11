'use strict';

var express      = require('express');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var mongoose     = require('mongoose');
var path         = require('path');
var errorhandler = require('errorhandler');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var config       = require('./config');



var allowCrossDomain = function(req, res, next) {
	// res.header( 'Access-Control-Allow-Origin',  'http://localhost:8080' );
	res.header('Access-Control-Allow-Origin',  req.headers.origin);
	// res.header( 'Access-Control-Allow-Origin',  '*' ); // temporarily allow all domains
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');

	next();
};

// Express configuration

module.exports = function(app) {
	var promise = new mongoose.Promise();

	var env = process.env.NODE_ENV || 'development';

	if (env === 'development') {
		// Disable caching of scripts for easier testing.

		app.use(function noCache( req, res, next) {
			if( req.url.indexOf('/scripts/') === 0) {
				res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
				res.header('Pragma', 'no-cache' );
				res.header('Expires', 0);
			}

			next();
		});


		// Error handler
		app.use(errorhandler());
	}

	app.use(bodyParser.urlencoded( { limit: '5mb', extended: true }));
	app.use(bodyParser.json({ limit: '5mb' }));



	// Use passport session
	app.use(session({
		store: new MongoStore({

			url: config.mongo.uri,
			db: 'node-sprout-store',
			clear_interval: 3600

		}),
		secret: config.sessionSecret,
		saveUninitialized: true,
		resave: false,
		proxy: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000 * 31, // 1 month
			secure: false,
			httpOnly: false
		}
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(allowCrossDomain);

	promise.fulfill();


	return promise;
};
