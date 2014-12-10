'use strict';

var path = require( 'path' );


// Send partial/directive, or 404 if it doesn't exist

exports.partials = function( req, res )
{
	// This gets rid of the file extension if there is one (ie. drops off .jade).
	var stripped = req.url.split( '.' )[ 0 ];

	var requestedView = path.join( './', stripped );

	// Render the requested partial or directive.
	res.render( requestedView, function( err, html )
	{
		if( err )
		{
			console.log( 'Error rendering partial: ' + requestedView + '"\n"', err );
			res.status( 404 );
			res.send( 404 );
		}
		else
		{
			res.send( html );
		}
	} );
};


// Send the single page app

exports.index = function( req, res )
{
	res.render( 'index' );
};
