'use strict';

var should    = require('should');
var supertest = require('supertest');
var mongoose  = require('mongoose');
var testUtils = require('../utils');



describe( 'List Behavior', function() {
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
				api = supertest.agent(aServerAndApp.app);
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


	it('Should add a list item', function(done) {
		api.post('/api/user/list')
		.send({

			listItem: {
				name: 'Wii U'
			}
		})
		.expect(200)
		.end(function(error, response) {
			response.body.newListItem.name.should.equal('Wii U');

			listItemId = response.body.newListItem._id;
			should.exist(listItemId);

			done();
		});
	});

	it('Should update a list item', function(done)
	{
		api.post( '/api/user/list' )
		.send({

			listItem: {
				_id: listItemId,
				name: 'GameCube'
			}
		})
		.expect(200)
		.end(function(error, response) {
			response.body.updatedListItem.name.should.equal('GameCube');
			done();
		});
	});

	it('Should get all the list items', function(done)
	{
		api.get('/api/user/list')
		.expect(200)
		.end( function(error, response) {
			console.log(response.body);
			response.body.listItems[0].name.should.equal('GameCube');
			done();
		});
	});

	it('Should delete a list item', function(done) {
		api.put('/api/user/list')
		.send({

			listItem: {
				_id: listItemId,
				name: 'GameCube'
			}
		})
		.expect(200)
		.end(function(error, response) {
			response.body.message.should.equal('Successfully deleted list item.');
			done();
		});
	});
});
