'use strict';

var should    = require( 'should' );
var supertest = require( 'supertest' );
var mongoose  = require( 'mongoose' );
var testUtils = require( '../utils' );



describe( 'User Register', function(  )
{
	console.log( 'TEst' );
	var api;
	var server;
	var User;
	var sandbox;



	// Create a server to test with,
	// an base api harness to test with,
	// and initialize User model.

	before( function( done )
	{
		testUtils.startTestServer( ).then( function( aServerAndApp )
		{
			try
			{
				server = aServerAndApp.server;
				api = supertest.agent( aServerAndApp.app );
				User = mongoose.model( 'User' );
			}
			catch( e )
			{
				throw e;
			}
			finally
			{
				done(  );
			}
		} );
	} );



	// Clear the database before the tests begin.

	before( function( done )
	{
		console.log( 'clear db' );

		testUtils.resetDatabase(  ).then( function(  )
		{
			done(  );
		},
		function( err )
		{
			throw err;
		} );
	} );



	// Close the server connection, so other tests can start one.

	after( function( done )
	{
		testUtils.stopTestServer( server, done );
	} );



	it( 'Should reject prelogin calls for blank or invalid email addresses', function( done )
	{
		api.get( '/api/user/preLogin' )
		.expect( 500 )
		.end( function( err, res )
		{
			should.not.exist( err );
			done( );
		} );
	} );

	it( 'Should return not found for unregistred email addresses', function( done )
	{
		api.get( '/api/user/prelogin?email=test@email.com' )
		.expect( 200 )
		.end( function( err, res )
		{
			should.not.exist( err );
			res.body.found.should.equal( false );
			should.not.exist( err );
			done(  );
		} );
	} );

	it( 'Should not register a user with short password', function( done )
	{
		testUtils.registerUser( api, 'test@email.com', 'secret', 500, 0 ).then( function( )
		{
			done( );
		} );
	} );

	it( 'Should succesfully register a user and return status code 200', function( done )
	{
		testUtils.registerUser( api, 'test@email.com',  'secret01' ).then( function(  )
		{
			done(  );
		} );
	} );

	it( 'Should return found for registred email addresses', function( done )
	{
		api.get( '/api/user/prelogin?email=test@email.com' )
		.expect( 200 )
		.end( function( err, res )
		{
			should.not.exist( err );
			res.body.found.should.equal( true );
			should.not.exist( err );
			done(  );
		} );
	} );


	it( 'Should not allow the registration of blank email & return status 500', function( done )
	{
		testUtils.registerUser( api, '', 'secret01', 500, 0 ).then( function( )
		{
			done(  );
		} );
	} );

	it( 'Should not allow the duplicate registration of same email', function( done )
	{
		var email = 'test@email.com';

		testUtils.registerUser( api, email, 'secret01', 500, 1 ).then( function( )
		{
			done(  );
		} );
	} );

	it( 'Should allow login', function( done )
	{
		var email = 'test4@email.com';
		testUtils.registerUser( api, email, 'secret01' ).then( function( )
		{
			// Bad login.
			api.post( '/api/user/session' )
			.send( {

				email: email,
				password: 'wrong secret'

			} )
			.expect( 401 )
			.end( function( err, res )
			{
				should.not.exist( err );

				// Good login.
				api.post( '/api/user/session' )
				.send( {

					email: email,
					password: 'secret01'

				} )
				.expect( 200 )
				.end( function( err, res )
				{
					should.not.exist( err );
					done(  );
				} );
			} );
		} );
	} );

} );
