'use strict';

var mongoose      = require('mongoose');
var crypto        = require('crypto');
var URLSafeBase64 = require('urlsafe-base64');


// Create a unique encrypted string.

var newEncryptedId = function() {
	var objectId = new mongoose.Types.ObjectId();
	objectId = objectId + '';

	var salt = crypto.randomBytes( 16 ).toString('base64');

	var encryptedIdBuf = crypto.pbkdf2Sync(objectId, salt, 10, 64);
	var encryptedId = URLSafeBase64.encode(encryptedIdBuf);

	return encryptedId;
};

exports.newEncryptedId = newEncryptedId;




var uuid = function() {
	var s4 = function() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	};

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

exports.uuid = uuid;



// Authenticate - check if the passwords are the same

var authenticate = function( plainText, salt, hashedPassword ) {
	return this.encryptPassword( plainText, salt ) === hashedPassword;
};

exports.authenticate = authenticate;



// Make salt

var makeSalt = function() {
	return crypto.randomBytes(16).toString('base64');
};

exports.makeSalt = makeSalt;




// Encrypt password

var encryptPassword = function(password, salt) {
	if(!password || !salt) {
		return '';
	}

	var bufferSalt = new Buffer(salt, 'base64');

	return crypto.pbkdf2Sync(password, bufferSalt, 10000, 64).toString('base64');
};

exports.encryptPassword = encryptPassword;
