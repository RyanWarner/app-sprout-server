'use strict';

var user     = require( './controllers/user' );
var session  = require( './controllers/session' );
var Promise  = require( 'bluebird' );



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

	app.post( '/api/user/session', function( req, res, next )
	{
		session.loginUser( req )
		.then( function(  )
		{
			res.json( req.user.userInfo );
		} )
		.catch( function( error )
		{
			res.status( 401 ).json( error );
		} );
	} );

	app.delete( '/api/user/session', session.logout );



	// Registration and login.

	app.post( '/api/user/register', function( req, res, next )
	{
		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.password;

		user.register( name, email, password )
		.then( function(  )
		{
			next(  );
		} )
		.catch( function( error )
		{
			console.log( error );
			res.status( 500 ).send( { message: error.message } );
		} );
	},
	function( req, res, next )
	{
		session.loginUser( req )
		.then( function(  )
		{
			res.json( req.user.userInfo );
		} )
		.catch( function( error )
		{
			res.status( 401 ).json( error );
		} );
	} );


	app.post( '/api/user/info', authRequired, function( req, res )
	{
		user.updateUserInfo( req, res )
		.then( function( userInfo )
		{
			console.log( userInfo );
			res.status( 200 ).send( userInfo );
		} )
		.catch( function( error )
		{
			res.status( 500 ).send( error );
		} );
	} );


	app.post( '/api/user/list', authRequired, user.upsertListItem );
	app.put( '/api/user/list', authRequired, function( req, res )
	{
		user.deleteListItem( req, res )
		.then( function(  )
		{
			res.status( 200 ).send( { 'message': 'Successfully deleted list item.' } );
		} )
		.catch( function( error )
		{
			res.status( 500 ).send( { 'message': 'Failed to send list item.' } );
		} );
	} );

	app.get( '/api/user/list', authRequired, user.getList );


	console.log( 'Routes successfully loaded.' );
};
