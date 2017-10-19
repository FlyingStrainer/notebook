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
const serviceAccount = require('./serviceAccountKey.json');

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


  saveNotebook(pName) {
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

  addEntry(userHash, notebookUuid, pText, pImage, pCaption, pDateCreated, pAuthorId) {
    const key = 'temp'; // TODO fix
    const newKey = admin.database().ref().child('posts').push().key;
    const notebookEntry = {
      uuid: key,
      text: pText,
      image: pImage,
      caption: pCaption,
      date_created: pDateCreated,
      author_id: pAuthorId,
    };
    const updates = {};
    updates[`/Notebooks/${notebookUuid}/data_entries/${newKey}`] = notebookEntry;
    return admin.database().ref().update(updates);
  },

  getNotebooks(userHash, callback) {
    admin.database().ref('/Notebooks').once('value').then((fbdatasnap) => {
      callback(fbdatasnap.val());
    });
  },

  deleteEntry(userHash, notebookId, userId) {
    const dataEntries = undefined; // TODO fix
    const entryId = undefined; // TODO fix
    admin.database().ref().child('Notebooks').child(notebookId)
      .child(dataEntries)
      .child(entryId)
      .remove();
  },
};
