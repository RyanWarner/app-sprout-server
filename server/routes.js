'use strict';

var index    = require( './controllers/index' );
var user     = require( './controllers/user' );
var session  = require( './controllers/session' );

// Application routes

module.exports = function( app )
{
	// Session handlers, used throughout express core.

	app.post( '/api/user/session', session.loginUser );
	app.delete( '/api/user/session', session.logout );


	// Registration and login.

	app.post( '/api/user/register', user.register );
	app.get(  '/api/user/preLogin', user.preLogin );



	app.get( '/partials/*', index.partials );
	app.get( '/directives/*', index.partials );
	app.get( '/*', index.index );
	console.log( 'in routes END' );
};
