'use strict';

var mongoose  = require('mongoose');
var should    = require('should');
var supertest = require('supertest');
var http      = require('http');
var config    = require('../server/config/config');


exports.startTestServer = function() {
	var promise = new mongoose.Promise();

	require('../serverSetup')().then( function(app) {
		var server = http.createServer(app);

		server.on('listening', function() {
			console.log('test server listening');
			promise.fulfill({ server: server, app: app });
		});

		server.listen(config.port);
	});

	return promise;
};

exports.stopTestServer = function(server, done) {
	mongoose.connection.close(function() {
		console.log('Mongoose closed');

		server.close(function() {
			console.log('Server closed');
			if(done) {
				done();
			}
		});
	});
};

exports.resetDatabase = function() {
	var User = mongoose.model('User');

	var promise = User.remove({ }).exec();
	promise = promise.then( function(result) { });

	return promise;
};

exports.registerUser = function(api, emailAddress, password, expectedStatusCode, expectedUsersLength) {

	if(expectedStatusCode === undefined) {
		expectedStatusCode = 200;
	}

	if(expectedUsersLength === undefined) {
		expectedUsersLength = 1;
	}

	console.log(expectedStatusCode);

	var promise = new mongoose.Promise();

	api
	.post('/api/user/register')
	.send({
		email: emailAddress,
		password: password
	})
	.expect(expectedStatusCode)
	.end(function(err, res) {
		if(err) {
			throw err;
		}

		var User = mongoose.model('User');

		User.find({ 'email': emailAddress }, function(findError, users) {
			if(findError) {
				console.log(findError);
				promise.reject(findError);
				return;
			}

			users.length.should.be.exactly(expectedUsersLength);

			var user = null;
			if(users.length > 0) {
				user = users[0];
			}

			promise.fulfill(user);
		});
	});

	return promise;
};
