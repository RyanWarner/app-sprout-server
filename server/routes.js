'use strict';

var user     = require( './controllers/user' );
var session  = require( './controllers/session' );



// Application routes

module.exports = function( app )
{
	var apiPending = function( req, res )
	{
		res.send( { msg: 'Not implemented yet.' }, 501 );
	};

	var authRequired = function( req, res, next )
	{
		console.log( 'Authorization is required. Are you authenticated?' );

		if( req.isAuthenticated(  ) )
		{
			console.log( 'Yes! You are authenticated.' );
			return next(  );
		}

		console.log( 'No, you are not authenticated.' );

		res.status( 401 ).send( { msg: 'Unauthorized.' } );
	};



	// Session handlers.

	app.post( '/api/user/session', session.loginUser );
	app.delete( '/api/user/session', session.logout );



	// Registration and login.

	app.post( '/api/user/register', user.register, session.loginUser );
	app.get(  '/api/user/preLogin', user.preLogin );


	app.post( '/api/user/list', authRequired, user.createListItem );
	// app.delete( '/api/user/list', authRequired, user.deleteListItem );
	app.get( '/api/user/list', authRequired, user.getList );


	console.log( 'Routes successfully loaded.' );
};
