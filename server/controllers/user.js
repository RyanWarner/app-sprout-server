'use strict';

var mongoose  = require('mongoose');
var User      = mongoose.model('User');
var ListItems = mongoose.model('ListItems');
var Promise   = require('bluebird');

Promise.promisifyAll(mongoose);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

var config    = require('../config/config.js');
var validator = require('validator');

exports.register = function(name, email, password) {
	console.log('UserController register();');

	return new Promise(function(resolve, reject) {
		User.register(name, email, password)
		.then(function(user) {
			resolve();
		},
		function(error) {
			console.log(error);
			reject(error);
		});
	});
};


exports.updateUserInfo = function(req, res, next) {
	var userId = req.user._id;
	var userInfo = req.body.userInfo;
	var name = userInfo.name;
	var email = userInfo.email;
	var password = userInfo.password;

	console.log(userInfo);

	return new Promise(function(resolve, reject) {
		User.findById({
			'_id': userId
		},
		function(error, user) {
			if(error) {
				console.log(error);
				reject(error);
			}

			if(user) {
				user.name = name;
				user.email = email;

				if(password) {
					user.password = password;
				}

				user.saveAsync()
				.then( function(savedUser) {
					resolve(user.userInfo);
				})
				.catch( function(saveError) {
					reject(saveError);
				});
			}
			else {
				reject({ 'message': 'No user found.' });
			}
		});
	});
};
