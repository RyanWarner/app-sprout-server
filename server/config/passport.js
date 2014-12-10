'use strict';

var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

var passport = require( 'passport' );

var LocalStrategy = require( 'passport-local' ).Strategy;

var config = require( './config' );

var utilities = require( '../utilities/utilities' );

var urlPrefix = config.hostname;


// Passport configuration

passport.serializeUser( function( user, done )
{
	var jsonObject = { id:user._id };
	done( null, JSON.stringify( jsonObject ) );
} );

passport.deserializeUser( function( userJsonString, done )
{
	var jsonObject = JSON.parse( userJsonString );
	if( jsonObject.kind === 'User' )
	{
		User.findOne( {

			'users._id': jsonObject.id
		},
		'-salt -hashedPassword', // don't ever give out the password or salt,
		function( err, user )
		{
			if( user )
			{
				user = merchant.users.id( jsonObject.id );
			}

			if( ! user )
			{
				console.log( 'invalid user session' );
				done( null, false );
				return;
			}

			done( err, user );
		} );
	}

} );

//
//	 (((((((------- Local User Strategy ---------)))))))
//
var localStrategyOptions = {
	usernameField: 'email',
	passwordField: 'password' // this is the virtual field on the model
};

var localUserStrategyCallback = function( email, password, done )
{
	User.findOne( {

		'email': email

	}, function( err, user )
	{
		if( err )
		{
			return done( err );
		}

		if( !user )
		{
			return done( null, false,
			{
				message: 'This email is not registered.'
			} );
		}

		if( !utilities.authenticate( password, user.salt, user.hashedPassword ) )
		{
			return done( null, false,
			{
				message: 'This password is not correct.'
			} );
		}

		return done( null, user );
	} );
};

var localUserStrategy = new LocalStrategy( localStrategyOptions, localUserStrategyCallback );
passport.use( 'local-user', localUserStrategy );

module.exports = passport;
