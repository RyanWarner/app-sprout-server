'use strict';

var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var utilities = require( '../utilities/utilities' );



// --------------+
// User Schema.  |
// --------------+

var authTypes = [ 'foursquare', 'twitter', 'facebook' ];

var UserSchema = new Schema( {
	_id: String,
	name: String,
	email: { type: String, unique: true },
	role:
	{
		type: String,
		default: 'user'
	},
	hashedPassword: String,
	provider: String,
	salt: String,
	twitter:
	{
		token: String,
		tokenSecret: String
	},
	facebook:
	{
		accessToken: String,
		refreshToken: String
	},
	foursquare:
	{
		accessToken: String,
		refreshToken: String
	},
	profile:
	{
		id: String,
		displayName: String,
		emails: [
		{
			value: String,
			type: String
		} ],
		photos:[ String ]
	}
} );




// Virtuals

UserSchema
	.virtual( 'password' )
	.set( function( password )
	{
		if( password.length < 8 )
		{
			throw new Error( 'password is too short' );
		}
		this._password = password;
		this.salt = utilities.makeSalt(  );
		this.hashedPassword = utilities.encryptPassword( password, this.salt );
	} )
	.get( function()
	{
		return this._password;
	} );

// Basic info to identify the current authenticated user in the app

UserSchema
	.virtual( 'userInfo' )
	.get( function(  )
	{
		return {
			'name': this.name,
			'role': this.role
		};
	} );

// Basic info to identify the current authenticated user in the app

UserSchema
	.virtual( 'user' )
	.get( function(  )
	{
		return this.parent(  );
	} );




//--------------+
// Validations  |
//--------------+


// Validate empty email

UserSchema
	.path( 'email' )
	.validate( function( email )
	{
		if( email === undefined )
		{
			return false;
		}

		// if you are authenticating by any of the oauth strategies, don't validate

		if( authTypes.indexOf( this.provider ) !== -1 )
		{
			return true;
		}

		return email.length;

	}, 'Email cannot be blank' );



// Validate empty password

UserSchema
	.path( 'hashedPassword' )
	.validate( function( hashedPassword )
	{

		// if you are authenticating by any of the oauth strategies, don't validate
		if( authTypes.indexOf( this.provider ) !== -1 )
		{
			return true;
		}

		return hashedPassword.length > 0;
	}, 'Password cannot be blank' );




var saveWithPromise = function( user )
{
	var promise = new mongoose.Promise( );

	user.save( function( err, savedUser )
	{
		if( err )
		{
			promise.reject( err );
		}
		else
		{
			promise.fulfill( savedUser );
		}
	} );

	return promise;
};




// ---------+
// Methods  |
// ---------+

UserSchema.statics =
{
	blankUser: function(  )
	{
		console.log( 'blankUser' );
		var newUser = new this(  );

		// encrypt user id
		newUser._id = utilities.newEncryptedId(  );
		//console.log( newUser );

		return newUser;
	},

	register: function( email, password  )
	{
		console.log( 'User.register(  );' );

		var newUser = this.blankUser( );

		newUser.email = email;
		newUser.password = password;

		return saveWithPromise( newUser );
	}
};

UserSchema.methods =
{

};

module.exports = mongoose.model( 'User', UserSchema );
