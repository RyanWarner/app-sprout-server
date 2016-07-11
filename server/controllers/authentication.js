'use strict';

var mongoose  = require('mongoose');
var passport  = require('passport');
var request   = require('request');
var config    = require('../config/config.js');
var utilities = require('../utilities/utilities');



// Login
exports.loginUser = function(req) {
	console.log('authentication.loginUser()');

	return new Promise( function(resolve, reject) {
		passport.authenticate( 'local-user', function(err, user, info) {
			var error = err || info;

			if(error) {
				reject(error);
			}

			req.login(user, function(loginError) {
				if(loginError) {
					console.log( 'Login eror: ', loginError);
					reject(loginError);
				}

				resolve();
			});
		})(req);
	});
};

// exports.loginWithTwitterToken = function( req, res, next )
// {
// 	passport.authenticate( 'twitter-token', function( err, user, info )
// 	{
// 		var error = err || info;
// 		if( error )
// 		{
// 			return res.json( 401, error );
// 		}

// 		req.logIn( user, function( loginError )
// 		{
// 			if( loginError )
// 			{
// 				return res.send( 500, { message: loginError.message } );
// 			}
// 			res.json( 200, req.user.userInfo );
// 		} );
// 	} )( req, res, next );
// };

// exports.loginWithFacebookToken = function( req, res, next )
// {
// 	console.log( 'loginWithFacebookToken' );
// 	var accessToken = req.params.accessToken;
// 	var get =
// 	{
// 		uri: 'https://graph.facebook.com/me/',
// 		json: true,
// 		qs:
// 		{
// 			access_token: accessToken
// 		}
// 	};

// 	request( get, function( err, response, body )
// 	{
// 		if( err )
// 		{
// 			return res.send( 500, { message: err.message } );
// 		}

// 		if( response.statusCode === 200 )
// 		{
// 			var id = body.id;
// 			var name = body.name;
// 			var photo = 'https://graph.facebook.com/' + id + '/picture?width=200&height=200';
// 			var fakeEmail = id + '@facebook.com';

// 			var User = mongoose.model( 'User' );

// 			User.findOne( { facebookId: id }, function( findError, user )
// 			{
// 				if( findError )
// 				{
// 					return res.send( 500, { message: findError.message } );
// 				}

// 				if( user === null )
// 				{
// 					user = new User( );
// 					user.name = name;
// 					user.photo = photo;
// 					user.provider = 'facebook';
// 					user.email = fakeEmail;
// 					user.salt = 'fake';
// 					user.hashedPassword = 'fake';
// 					user._id = utilities.newEncryptedId(  );
// 					user.facebookId = id;
// 				}

// 				user.save( function( saveError, savedUser, numAffect )
// 				{
// 					if( saveError )
// 					{
// 						return res.send( 500, { message: saveError.message } );
// 					}
// 					req.logIn( savedUser, function( loginError )
// 					{
// 						if( loginError )
// 						{
// 							return res.send( 500, { message: loginError.message } );
// 						}

// 						return res.json( 200, req.user.userInfo );
// 					} );
// 				} );
// 			} );
// 		}
// 		else
// 		{
// 			return res.send( 500, { message: 'Facebook verification failed.' } );
// 		}

// 	} );
// };


// exports.twitterReverseAuthStepOne = function( req, res, next )
// {
// 	var post =
// 	{
// 		url: 'https://api.twitter.com/oauth/request_token',
// 		oauth:
// 		{
// 			consumer_key: config.twitter.consumer_key,
// 			consumer_secret: config.twitter.consumer_secret
// 		},
// 		form:
// 		{
// 			x_auth_mode: 'reverse_auth'
// 		}
// 	};

// 	request.post( post, function( err, response, body )
// 	{
// 		if( err )
// 		{
// 			return res.send( 500, { message: err.message } );
// 		}

// 		if( body.indexOf( 'OAuth' ) !== 0 )
// 		{
// 			return res.send( 500, { message: 'Malformed response from Twitter' } );
// 		}

// 		res.send( 200, { x_reverse_auth_parameters: body } );
// 	} );
// };
