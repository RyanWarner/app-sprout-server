'use strict';

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var utilities = require('../utilities/utilities');



// --------------+
// User Schema.  |
// --------------+

var authTypes = ['twitter', 'facebook'];

var UserSchema = new Schema( {
	_id: String,
	name: String,
	email: {
		type: String,
		unique: true
	},
	role: {
		type: String,
		default: 'user'
	},
	hashedPassword: String,
	provider: String,
	salt: String,
	twitter: {
		token: String,
		tokenSecret: String
	},
	facebook: {
		accessToken: String,
		refreshToken: String
	},
	profile:
	{
		id: String,
		displayName: String
	},
	// This is a document reference example.
	// Because 'list' is simple, and does not have deep
	// nesting, it doesn't really NEED to be a document reference
	// and could be embedded instead (like the profile object for example).
	// See: http://stackoverflow.com/questions/5373198/mongodb-relationships-embed-or-reference
	list:
	[
		{
			type: String,
			ref: 'ListItem'
		}
	]
} );




// Virtuals

UserSchema
	.virtual('password')
	.set( function(password) {
		if(password === undefined) {
			this.invalidate('password', 'must be at least 6 characters.');
		}

		if((password) && (password.length < 6)) {
			this.invalidate('password', 'must be at least 6 characters.');
		}

		this._password = password;
		this.salt = utilities.makeSalt();
		this.hashedPassword = utilities.encryptPassword(password, this.salt);
	})
	.get(function() {
		return this._password;
	});

// Basic info to identify the current authenticated user in the app

UserSchema
	.virtual('userInfo')
	.get(function()  {
		return {
			'name': this.name,
			'email': this.email,
			'role': this.role
		};
	});



//--------------+
// Validations  |
//--------------+


// Validate empty email.

UserSchema
	.path('email')
	.validate(function(email) {
		if(email === undefined) {
			return false;
		}

		// If you are authenticating by any of the oauth strategies, don't validate.

		if(authTypes.indexOf(this.provider) !== -1) {
			return true;
		}

		return email.length;

	}, 'Email cannot be blank');



// Validate empty password.

UserSchema
	.path('hashedPassword')
	.validate(function(hashedPassword) {

		// If you are authenticating by any of the oauth strategies, don't validate.
		if(authTypes.indexOf(this.provider) !== -1) {
			return true;
		}

		return hashedPassword.length > 0;
	}, 'Password cannot be blank');




var saveWithPromise = function(user) {
	var promise = new mongoose.Promise();

	user.save(function(err, savedUser) {
		if(err) {
			promise.reject(err);
		}
		else {
			promise.fulfill(savedUser);
		}
	});

	return promise;
};




// ---------+
// Methods  |
// ---------+

UserSchema.statics = {
	blankUser: function() {
		console.log('User.blankUser()');

		var newUser = new this();

		// Encrypt user ID.
		newUser._id = utilities.newEncryptedId();

		return newUser;
	},

	register: function(name, email, password) {
		console.log('User.register();');

		var newUser = this.blankUser();

		newUser.name = name;
		newUser.email = email;
		newUser.password = password;

		return saveWithPromise(newUser);
	}
};

UserSchema.methods = {

};

module.exports = mongoose.model('User', UserSchema);
