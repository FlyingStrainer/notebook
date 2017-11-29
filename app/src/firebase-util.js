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
const pdfgen = require('./PDFGen.js');
const querydb = require('./querydb.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

pdfgen.init(admin);
querydb.init(admin);

module.exports = {
  pdfgen,
  querydb,

  createUser(email, password, company_name) {
    return new Promise(((resolve, reject) => {
      module.exports.loginUser(email, password)
        .then(() => {
          reject(new Error('email already exists'));
        })
        .catch((err) => {
          if (err.message === 'email not found') {
            const user_hash = admin.database().ref('UserList').push().key;

            const user_data = {
              email,
              password,
              user_hash,
              company_name,
            };

            const email64 = Buffer.from(email).toString('base64');

            const update = {};
            update[`login_info/${email64}`] = user_data;
            update[`UserList/${user_hash}`] = {
              user_hash,
              company_name,
              role_list: {
                user: true,
              },
              notebooks: {},
            };

            admin.database().ref().update(update)
              .then(() => {
                delete user_data.password;
                resolve(user_data);
              })
              .catch(reject);
          } else {
            reject(err);
          }
        });
    }));
  },

  loginUser(email, password) {
    const email64 = Buffer.from(email).toString('base64');

    return new Promise(((resolve, reject) => {
      admin.database().ref(`login_info/${email64}`).once('value')
        .then((snap) => {
          const user_data = snap.val();
          if (user_data) {
            if (user_data.password === password) {
              delete user_data.password;
              resolve(user_data);
            } else {
              reject(new Error('incorrect password'));
            }
          } else {
            reject(new Error('email not found'));
          }
        })
        .catch(reject);
    }));
  },

  checkUser(user_hash) {
    return admin.database().ref(`UserList/${user_hash}`).once('value')
      .then((snap) => {
        const user = snap.val();

        if (user) {
          user.notebooks = user.notebooks || {};
          user.notebooks = Object.keys(user.notebooks);

          return user;
        }

        return Promise.reject(new Error('user not found'));
      });
  },

  // NOTE not used in frontend
  // getNotebooks(user_hash) {
  //   return module.exports.checkUser(user_hash).then(user => ({notebooks: user.notebooks}));
  // },

  saveNotebook(user_hash, _name) {
    return admin.database().ref(`UserList/${user_hash}`).child('UserList').child('user_hash').once('value', (fbdatasnap) => {
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

  managerView(user_hash) {
    return admin.database().ref(`/UserList/${userHash}/Notebooks/`).once('value');
  },

  getNotebook(user_hash, notebook_hash) {
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value')
      .then((snap) => {
        if (fbdatasnap.val() !== null) {
          return fbdatasnap.val();
        }

        throw new Error('can\'t find notebook');
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

    for (let i = 0; i < change_list.length; i++) {
      const type = user_list[i].type;
      const user_hash = user_list[i].user_hash;

      if (type === 'add') {
        updates[`UserList/${user_hash}/notebooks/${notebook_hash}`] = true;
      } else if (type === 'remove') {
        updates[`UserList/${user_hash}/notebooks/${notebook_hash}`] = null;
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

        throw 'can\'t find notebook';
      });
  },

  format(user_hash, notebook_hash, format) {
    const updates = {};
    updates[`/NotebookList/${notebook_hash}/format`] = format;

    return admin.database().ref().update(updates);
  },
};
