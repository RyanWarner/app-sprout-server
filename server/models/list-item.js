'use strict';

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var utilities = require('../utilities/utilities');



// -------------------+
// List Item Schema.  |
// -------------------+

var ListItemSchema = new Schema({

	_id: String,
	user: String,
	name: String
});


var saveWithPromise = function(listItem) {
	var promise = new mongoose.Promise();

	listItem.save(function(error, savedListItem) {
		if(error) {
			promise.reject(error);
		}
		else {
			promise.fulfill(savedListItem);
		}
	});

	return promise;
};




// ---------+
// Methods  |
// ---------+

ListItemSchema.statics = {
	blankListItem: function() {
		console.log('listItem.newListItem()');

		var newListItem = new this();

		// Encrypt user ID.
		newListItem._id = utilities.newEncryptedId();

		return newListItem;
	},

	createListItem: function(user, itemName) {
		console.log('User.register();');

		var newListItem = this.blankListItem();

		newListItem.user = user;
		newListItem.name = itemName;

		return saveWithPromise(newListItem);
	}
};

ListItemSchema.methods = {

};

module.exports = mongoose.model('ListItems', ListItemSchema);
