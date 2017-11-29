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


module.exports = {
  loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    // ...
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(user);
      } else {
        // No user is signed in.
      }
    });
  },

  createUser(username, date_added, usr_id) {
    const user = {username, initDate: date_added, userId: usr_id};
    return user;
  },

  saveNotebook(user_hash, _name) {
    admin.database().child('UserList').child('user_hash').once('value', (fbdatasnap) => {
      const exists = (fbdatasnap.val() !== null);
      saveNotebookCB(
        user_hash, notebook_uuid, _text, _image,
        _caption, _dateCreated, _authorID, _tagArr, exists,
      );
    });
  },

  saveNotebookCB(user_hash, _name) {
    const updates = {};
    if (exists === false) return;
    // Add notebook updates
    const new_notebook_key = admin.database().ref('NotebookList').push().key;
    const notebook = new Notebook({
      uuid: new_notebook_key,
      name: _name,
      managerList: [],
    });
    updates[`/NotebookList/${new_notebook_key}`] = notebook;

    // Add user updates
    updates[`/UserList/${user_hash}/NotebookList/${new_notebook_key}`] = true;

    return admin.database().ref().update(updates);
  },

  addEntry(user_hash, notebook_uuid, _text, _image, _caption, _date_created, _authorID, _tagArr) {
    admin.database().child('UserList').child('user_hash').once('value', (fbdatasnap) => {
      const exists = (fbdatasnap.val() !== null);
      addEntryCB(
        user_hash, notebook_uuid, _text, _image,
        _caption, _dateCreated, _authorID, _tagArr, exists,
      );
    });
  },

  addEntryCB(
    user_hash, notebook_uuid, _text, _image,
    _caption, _date_created, _authorID, _tag_arr, exists,
  ) {
    if (exists === false) return;
    const new_key = admin.database().ref().child('NotebookList').child(notebook_uuid)
      .child('Entries')
      .push().key;
    const notebookEntry = {
      uuid: new_key,
      text: _text,
      image: _image,
      caption: _caption,
      date_created: _date_created,
      author_id: _authorID,
      tags: _tagArr,
    };
    const updates = {};
    updates[`/NotebookList/${notebook_uuid}/data_entries/${newKey}`] = notebookEntry;
    return admin.database().ref().update(updates);
  },

  getEntries(user_hash, _uuid, callback) {
    admin.database().ref(`/NotebookList/${_uuid}/data_entries/`).once('value').then((fbdatasnap) => {
      callback(JSON.stringify(Object.keys(fbdatasnap.val())));
    });
  },

  getEntry(user_hash, _uuid, entry_id, callback) {
    admin.database().ref(`/NotebookList/${_uuid}/data_entries/${entry_id}/`).once('value').then((fbdatasnap) => {
      callback(fbdatasnap.val());
    });
  },

  checkUser(user_hash, callback) {
    admin.database().child('UserList').child('user_hash').once('value', (fbdatasnap) => {
      const exists = (fbdatasnap.val());
      if (fbdatasnap !== null) { callback(exists); }
    });
  },

  getNotebooks(userHash, callback) {
    admin.database().ref(`/UserList/${userHash}/Notebooks/`).once('value').then((fbdatasnap) => {
      if (fbdatasnap.val() !== null) { callback(fbdatasnap.val()); }
    });
  },

  managerView(user_hash) {
    return admin.database().ref(`/UserList/${userHash}/Notebooks/`).once('value');
  },

  getNotebook(user_hash, notebook_hash) {
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value')
      .then((snap) => {
        if (fbdatasnap.val() !== null) {
          return fbdatasnap.val();
        }
        else {
          throw 'can\'t find notebook';
        }
      });
  },

  feedback(message) {
    const new_key = admin.database().ref('feedback').push().key;

    const updates = {};
    updates[`/feedback/${new_notebook_key}`] = message;

    return admin.database().ref().update(updates);
  },

  setNotebookPermisions(user_hash, notebook_hash, change_list) {
    const updates = {};
    updates[`/NotebookList/${notebook_hash}/permisions`] = message;

    for (var i = 0; i < change_list.length; i++) {
      const type = user_list[i].type;
      const user_hash = user_list[i].user_hash;

      if (type === 'add') {
        updates[`UserList/${user_hash}/notebook_list/${notebook_hash}`] = true;
      }
      else if (type === 'remove') {
        updates[`UserList/${user_hash}/notebook_list/${notebook_hash}`] = null;
      }
    }

    return admin.database().ref().update(updates);
  },

  getLink(user_hash, notebook_hash) {
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value')
      .then((snap) => {
        if (fbdatasnap.val() !== null) {
          return fbdatasnap.val();
        }
        else {
          throw 'can\'t find notebook';
        }
      });
  },

  format(user_hash, notebook_hash, format) {
    const updates = {};
    updates[`/NotebookList/${notebook_hash}/format`] = format;

    return admin.database().ref().update(updates);
  }
};
