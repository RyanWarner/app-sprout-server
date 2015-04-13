'use strict';

var mongoose  = require( 'mongoose' );
var User      = mongoose.model( 'User' );
var config    = require( '../config/config.js' );
var validator = require( 'validator' );

exports.register = function( req, res, next )
{
	console.log( 'UserController register( );' );
	console.log( req.body );

	User.register( req.body.email, req.body.password )
	.then( function( user )
	{
		req.logIn( user, function( err )
		{
			if( err )
			{
				console.log( err );
				res.status( 500 ).send( { message: err.message } );
			}
			else
			{
				return res.json( req.user.userInfo );
			}

		} );

		return;
	},
	function( err )
	{
		console.log( err );
		res.status( 500 ).send( { message: err.message } );
	} ).end(  );
};

exports.preLogin = function( req, res, next )
{
	var email = req.query.email;

	if( !validator.isEmail( email ) )
	{
		res.status( 500 ).send( { message: 'Email is invalid' } );
	}
	else
	{
		User.findOne( { 'email': decodeURIComponent( email ) }, function( err, user )
		{
			if( err )
			{
				console.log( err );
				res.status( 500 ).send( { message: err.message } );
			}
			else
			{
				if( user )
				{
					res.status( 200 ).send( { found: true } );
				}
				else
				{
					res.status( 200 ).send( { found: false } );
				}
			}
		} );
	}
};

exports.createListItem = function( req, res, next )
{
	var userId = req.user._id;
	var listItem = req.body.listItem;

	User.findByIdAndUpdate(
	{
		'_id': userId
	},
	{
		$push:
		{
			'list': listItem
		}
	},
	{
		upsert: true
	},
	function( error, user )
	{
		if( err )
		{
			console.log( err );
			res.status( 500 ).send( { message: err.message } );
		}
		else
		{
			if( user )
			{
				res.status( 200 ).send( list: user.list );
			}
			else
			{
				res.status( 500 ).send( message: 'No user found.' );
			}
		}
	} );
};

exports.deleteListItem = function( req, res, next )
{

};

exports.getList = function( req, res, next )
{

};
