// -----------FirebaseInit.js----------
// This file creates the initial Notebook database structure
// Can be used to add notebooks in the future

// Author: Mehul Patel
// Date Created: 10/1/2017
//------------------------------------

/*
eslint import/no-unresolved: [2, {
  ignore: ['\./serviceAccountKey.json$']
}]
*/

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

// const database = admin.database();

module.exports = {
  createUser(username, dateAdded, usrId) {
    const user = {username, initDate: dateAdded, userId: usrId};
    return user;
  },


  saveNotebook(user_hash, _name) {
    const newKey = admin.database().ref().child('posts').push().key;
    const notebook = {
      uuid: newKey,
      name: pName,
      author: 'Current User',
      dataEntries: '',
    };
    const updates = {};
    updates[`/Notebooks/${newKey}`] = notebook;
    return admin.database().ref().update(updates);
  },

  addEntry: function (user_hash, notebook_uuid, _text, _image,
    _caption, _dateCreated, _authorID, _tagArr){
		var newKey = admin.database().ref().child('posts').push().key;
		var notebookEntry = {
			uuid: newKey,
			text: _text,
			image: _image,
			caption: _caption,
			date_created: _dateCreated,
			author_id: _authorID,
      		tags: _tagArr
		};
		var updates = {};
		updates['/Notebooks/' + notebook_uuid + '/data_entries/' + newKey] = notebookEntry;
		return admin.database().ref().update(updates);
	},

	getEntries: function (user_hash, _uuid, callback) {
		admin.database().ref('/Notebooks/' + _uuid + '/data_entries/').once('value').then(function(fbdatasnap) {
			callback(fbdatasnap.val());
		  });
	},

	//todo
  getNotebooks: function (userHash, callback) {
    admin.database().ref('/Notebooks').once('value').then((fbdatasnap) => {
      callback(fbdatasnap.val());
    });
  }
};
