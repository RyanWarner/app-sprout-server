'use strict';

var path = require('path');
var os = require('os');

var rootPath = path.normalize(path.join(__dirname, '/../../..'));



module.exports = {
	root: rootPath,
	port: process.env.NODE_PORT,
	hostname: process.env.NODE_HOST,
	sessionSecret: process.env.SESSION_SECRET,

	mongo: {
		uri: 'mongodb://localhost/node-sprout-dev',  // Setup Config (!)
		options: {
			db: {
				safe: true
			}
		}
	}
};
