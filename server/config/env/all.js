'use strict';

var path = require( 'path' );
var os = require( 'os' );

var rootPath = path.normalize( path.join( __dirname, '/../../..' ) );



module.exports =
{
	root: rootPath,
	port: process.env.PORT,
	hostname: process.env.MAIN_STREET_HOST,
	sessionSecret: process.env.SESSION_SECRET,

	baseUrl: function( )
	{
		var ss = 'https://';
		if( process.env.NODE_ENV === 'development' )
		{
			ss = 'http://';
		}
		return ss + this.hostname;
	},

	mongo:
	{
		uri: 'mongodb://localhost/stranger-dev',
		options:
		{
			db:
			{
				safe: true
			}
		}
	}
};
