'use strict';

var mongoose  = require( 'mongoose' );
var User      = mongoose.model( 'User' );
var ListItems = mongoose.model( 'ListItems' );
var Promise   = require( 'bluebird' );

var config    = require( '../config/config.js' );
var validator = require( 'validator' );

exports.register = function( req, res, next )
{
	console.log( 'UserController register( );' );
	console.log( req.body );

	User.register( req.body.email, req.body.password )
	.then( function( user )
	{
		next(  );
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

var createNewListItem = function( userId, listItem )
{
	return new Promise( function( resolve, reject )
	{
		ListItems.createListItem( userId, listItem )
		.then( function( newListItem )
		{
			console.log( '' );
			console.log( '' );
			console.log( 'newListItem', newListItem );
			console.log( '' );
			console.log( '' );
			User.findByIdAndUpdate(
			{
				'_id': userId
			},
			{
				$push:
				{
					'list': newListItem._id
				}
			},
			function( error, user )
			{
				if( error )
				{
					console.log( error );
					reject( error );
				}
				else
				{
					if( user )
					{
						resolve( { 'newListItem': newListItem } );
					}
					else
					{
						console.log( error );
						reject( { 'message': 'No user found.' } );
					}
				}
			} );
		} );
	} );
};

var updateListItem = function( listItemId, listItemValue )
{
	console.log( 'updateListItem', listItemId, listItemValue );

	return new Promise( function( resolve, reject )
	{
		ListItems.findOneAndUpdate(
		{
			'_id': listItemId
		},
		{
			'name': listItemValue
		},
		function( error, listItem )
		{
			console.log( '--=-=-=-=-=-=-=--' );
			console.log( '' );
			console.log( 'listItem', listItem );
			console.log( '' );
			console.log( '--=-=-=-=-=-=-=--' );
			if( error )
			{
				console.log( error );
				reject( error );
			}
			else
			{
				if( listItem )
				{
					resolve( { 'updatedListItem': listItem } );
				}
				else
				{
					reject( { 'message': 'No listItem found.' } );
				}
			}
		} );
	} );
};

exports.upsertListItem = function( req, res, next )
{
	var userId        = req.user._id;
	var listItem      = req.body.listItem;
	var listItemValue = listItem.name;
	var listItemId    = listItem._id;

	if( listItemId )
	{
		// Update an existing list item.
		updateListItem( listItemId, listItemValue )
		.then( function( updatedListItem )
		{
			res.status( 200 ).send( updatedListItem );
		} )
		.catch( function( error )
		{
			res.status( 500 ).send( { 'message': error.message } );
		} );
	}
	else
	{
		// Create a new list item.
		createNewListItem( userId, listItemValue )
		.then( function( newListItem )
		{
			res.status( 200 ).send( newListItem );
		} )
		.catch( function( error )
		{
			res.status( 500 ).send( { 'message': error.message } );
		} );
	}

	
};

exports.deleteListItem = function( req, res, next )
{

};

exports.getList = function( req, res, next )
{
	var userId = req.user._id;

	ListItems.find(
	{
		user: userId
	},
	function( error, listItems )
	{
		if( !error )
		{
			res.status( 200 ).send( { 'listItems': listItems } );
		}
		else
		{
			console.log( error );
			res.status( 500 ).send( { 'message': 'Error getting list items.' } );
		}
	} );
};
