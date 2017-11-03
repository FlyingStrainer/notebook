// -----------firebase-util.js----------
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
const Notebook = require('./objects/Notebook');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

// const database = admin.database();

var userExists = false;

module.exports = {
  createUser(username, dateAdded, usrId) {
    const user = {username, initDate: dateAdded, userId: usrId};
    return user;
  },


  saveNotebook(user_hash, _name) {
    const updates = {};

    // Add notebook updates
    const newNotebookKey = admin.database().ref('NotebookList').push().key;
    const notebook = new Notebook({
      uuid: newNotebookKey,
      name: _name,
      managerList: [],
    });
    updates[`/NotebookList/${newNotebookKey}`] = notebook;

    // Add user updates
    updates[`/UserList/${user_hash}/NotebookList/${newNotebookKey}`] = true;

    return admin.database().ref().update(updates);
  },

  addEntry( user_hash, notebook_uuid, _text, _image,
    _caption, _dateCreated, _authorID, _tagArr) {
    checkUserExists(user_hash);
    if (userExists == false) return; 
    const newKey = admin.database().ref().child('NotebookList').child(notebook_uuid).
      child('Entries').push().key;
    const notebookEntry = {
      uuid: newKey,
      text: _text,
      image: _image,
      caption: _caption,
      date_created: _dateCreated,
      author_id: _authorID,
      tags: _tagArr,
    };
    const updates = {};
    updates[`/NotebookList/${notebook_uuid}/data_entries/${newKey}`] = notebookEntry;
    return admin.database().ref().update(updates);
  },

  getEntries(user_hash, _uuid, callback) {
    admin.database().ref(`/NotebookList/${_uuid}/data_entries/`).once('value').then((fbdatasnap) => {
      callback(fbdatasnap.val());
    });
  },

  userExistsCB(exists) {
    if (exists) {
      userExists = true;
    }
  },

  checkUserExists(user_hash) {
    admin.database().child('UserList').child('user_hash').once('value', function(fbdatasnap) {
      var exists = (fbdatasnap.val() !== null);
      userExistsCB(exists);
    })
  },
  // todo
  getNotebooks(userHash, callback) {
    admin.database().ref(`/UserList/${userHash}/`).once('value').then((fbdatasnap) => {
      callback(fbdatasnap.val());
    });
  },
};
