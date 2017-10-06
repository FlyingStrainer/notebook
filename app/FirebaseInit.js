//-----------FirebaseInit.js----------
//This file creates the initial Notebook database structure
//Can be used to add notebooks in the future

//Author: Mehul Patel
//Date Created: 10/1/2017
//------------------------------------
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vent-91586.firebaseio.com"
});

var database = admin.database();



module.exports = {
	createUser: function (username, dateAdded, usrID) {
	  var user = {username: username, initDate: dateAdded, userID: usrID};
	  return user;
	},


	savenotebook: function (pName, user_hash) {
		var newKey = admin.database().ref().child('posts').push().key;
		var notebook = {
			uuid: newKey,
			name: pName,
			author: user_hash,
			data_entries: ""
		};
		var updates = {};
		updates['/Notebooks/' + newKey] = notebook;
		return admin.database().ref().update(updates);
	},

	// addentry: function (user_hash, notebook_uuid, pText, pImage, pCaption, pDateCreated, pAuthorID){
	addentry: function (user_hash, notebook_uuid, entry){
		var newKey = admin.database().ref().child('posts').push().key;
		var notebookEntry = {
			uuid: newKey,
			entry: entry,
		};
		var updates = {};
		updates['/Notebooks/' + notebook_uuid + '/data_entries/' + newKey] = notebookEntry;
		return admin.database().ref().update(updates);
	},

	getnotebooks: function (user_hash, callback) {
		admin.database().ref('/Notebooks').once('value').then(function(fbdatasnap) {
			callback(fbdatasnap.val());
		  });
	},

	deleteentry: function (user_hash, notebookID, eid) {
		admin.database().ref().child('Notebooks').child(notebookID).child('data_entries').child(eid).remove();
	}
};
