'use strict';

var express      = require( 'express' );
var session      = require( 'express-session' );
var mongoose     = require( 'mongoose' );
var path         = require( 'path' );
var errorhandler = require( 'errorhandler' );
var bodyParser   = require( 'body-parser' );
var passport     = require( 'passport' );
var config       = require( './config' );


var rootPath = path.normalize( path.join( __dirname, '/../..' ) );


var allowCrossDomain = function( req, res, next )
{
	// res.header( 'Access-Control-Allow-Origin',  'http://192.168.0.33:8100' );
	res.header( 'Access-Control-Allow-Origin',  '*' ); // temporarily allow all domains
	//res.header( 'Access-Control-Allow-Credentials', true );
	res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS' );
	res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept' );

	next(  );
};

// Express configuration

module.exports = function( app )
{
	var promise = new mongoose.Promise(  );

	var env = process.env.NODE_ENV || 'development';

	if ( env === 'development' )
	{
		// Disable caching of scripts for easier testing.

		app.use( function noCache( req, res, next )
		{
			if( req.url.indexOf( '/scripts/' ) === 0 )
			{
				res.header( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
				res.header( 'Pragma', 'no-cache' );
				res.header( 'Expires', 0 );
			}

			next(  );
		} );



		// Error handler

		app.use( errorhandler(  ) );
	}

	app.use( bodyParser.urlencoded( { extended: true } ) );

	app.use( bodyParser.json(  ) );



	//use passport session

	app.use( session(
	{
		secret: config.sessionSecret,
		saveUninitialized: true,
		resave: true
	} ) );

	app.use( allowCrossDomain );

	app.use( passport.initialize(  ) );
	app.use( passport.session(  ) );

	promise.fulfill(  );


	return promise;
};
