'use strict';

var express      = require( 'express' );
var session      = require( 'express-session' );
var mongoose     = require( 'mongoose' );
var path         = require( 'path' );
var errorhandler = require( 'errorhandler' );
var bodyParser   = require( 'body-parser' );
var passport     = require( 'passport' );


var rootPath = path.normalize( path.join( __dirname, '/../..' ) );



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
		secret: '2av8dfeb-23dc-11f9-s5b4-52uia916433e',
		saveUninitialized: true,
		resave: true
	} ) );

	app.use( passport.initialize(  ) );
	app.use( passport.session(  ) );

	promise.fulfill(  );


	return promise;
};
