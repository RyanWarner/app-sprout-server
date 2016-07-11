'use strict';

var should    = require('should');
var supertest = require('supertest');
var mongoose  = require('mongoose');
var testUtils = require('../utils');



describe('User Register', function() {
	var api;
	var server;
	var User;
	var sandbox;
	var listItemId;



	// Create a server to test with,
	// an base api harness to test with,
	// and initialize User model.

	before(function(done) {
		testUtils.startTestServer().then(function(aServerAndApp) {
			try {
				server = aServerAndApp.server;
				api = supertest.agent( aServerAndApp.app);
				User = mongoose.model('User');
			}
			catch(e) {
				throw e;
			}
			finally {
				done();
			}
		});
	});



	// Clear the database before the tests begin.

	before(function(done) {
		console.log('Clear database.');

		testUtils.resetDatabase().then(function() {
			done();
		},
		function(err) {
			throw err;
		});
	});

	before(function(done) {
		testUtils.registerUser(api, 'test@email.com',  'secret01')
		.then(function() {
			done();
		});
	});



	// Close the server connection, so other tests can start one.

	after(function(done) {
		testUtils.stopTestServer(server, done);
	});


	it('Should update the users account information', function(done) {
		api.post('/api/user/info')
		.send({

			userInfo: {
				name: 'Ryan',
				email: 'updated@email.com',
				password: 'my_new_password'
			}
		})
		.expect(200)
		.end(function(error, response) {
			response.body.name.should.equal('Ryan');
			response.body.email.should.equal('updated@email.com');

			done();
		});
	});
});
