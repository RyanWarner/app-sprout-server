'use strict';

var mongoose      = require('mongoose');
var User          = mongoose.model('User');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config        = require('./config');
var utilities     = require('../utilities/utilities');


// Passport configuration

passport.serializeUser( function(user, done) {
	console.log( 'PassportConfig.serializeUser();' );

	var userId = user._id;

	done(null, userId);
});

passport.deserializeUser( function(userId, done) {
	console.log( 'PassportConfig.deserializeUser();' );

	User.findOne({

		'_id': userId
	},
	'-salt -hashedPassword', // don't ever give out the password or salt.
	function(err, user) {
		if(!user) {
			console.log('Invalid user session.');
			done(null, false);
			return;
		}

		done(err, user);
	});
});



//-------------------------+
//   Local User Strategy   |
//-------------------------+

var localStrategyOptions = {
	usernameField: 'email',
	passwordField: 'password' // This is the virtual field on the model.
};

var localUserStrategyCallback = function(email, password, done) {
	User.findOne({
		'email': email
	},
	function(err, user)
	{
		if(err) {
			return done(err);
		}

		if(!user) {
			return done(null, false, {
				message: 'This email is not registered.'
			});
		}

		if(!utilities.authenticate(password, user.salt, user.hashedPassword)) {
			return done(null, false, {
				message: 'This password is not correct.'
			});
		}

		return done(null, user);
	});
};

var localUserStrategy = new LocalStrategy(localStrategyOptions, localUserStrategyCallback);
passport.use('local-user', localUserStrategy);

module.exports = passport;
