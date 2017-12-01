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
const CJSON = require('./objects/CJSON.js');
const nodemailer = require('nodemailer');

const sessionEmailLimit = process.env.EMAIL_LIMIT || 5;
let sessionEmailCount = 0;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

pdfgen.init(admin);
querydb.init(admin);

module.exports = {
  firebaseAdmin: admin,
  pdfgen,
  querydb,

  // action: read, write, manager
  checkNotebookPermission(user_hash, notebook_hash, action) {
    const path = `UserList/${user_hash}/permissions/notebooks/${notebook_hash}`;
    return admin.database().ref(path).once('value')
      .then((data) => {
        const permission = data.val();
        return permission && permission[action];
      });
  },

  createUser(email, password, company_name) {
    return new Promise(((resolve, reject) => {
      module.exports.loginUser(email, password)
        .then(() => {
          reject(new Error('email already exists'));
        })
        .catch((err) => {
          if (err.message === 'email not found') {
            admin.database().ref(`companies/${company_name}`).once('value')
              .then((snap) => {
                const initCompany = !snap.val();
                const user_admin = !snap.val();

                const update = {};

                const user_hash = admin.database().ref('UserList').push().key;

                const email64 = Buffer.from(email).toString('base64');

                const login_data = {
                  email,
                  password,
                  user_hash,
                  company_name,
                };
                update[`login_info/${email64}`] = login_data;

                const user_data = {
                  email,
                  user_hash,
                  permissions: {
                    role: user_admin ? 'admin' : 'user',
                    create_notebooks: true,
                    notebooks: {},
                  },
                  company_name,
                };
                update[`UserList/${user_hash}`] = user_data;

                if (initCompany) {
                  const company_users = {};
                  company_users[user_hash] = true;

                  const company_emails64 = {};
                  company_emails64[email64] = true;

                  const company_data = {
                    company_name,
                    admin_hash: user_hash,
                    emails64: company_emails64,
                    users: company_users,
                    notebooks: {},
                  };

                  update[`companies/${company_name}`] = company_data;
                } else {
                  update[`companies/${company_name}/users/${user_hash}`] = true;
                  update[`companies/${company_name}/emails64/${email64}`] = true;
                }

                admin.database().ref().update(update)
                  .then(() => {
                    delete login_data.password;
                    resolve(login_data);
                  })
                  .catch(reject);
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
          user.permissions.notebooks = user.permissions.notebooks || {};
          user.notebook_list = Object.keys(user.permissions.notebooks);

          return user;
        }

        return Promise.reject(new Error('user not found'));
      });
  },

  // NOTE not used in frontend
  // getNotebooks(user_hash) {
  //   return module.exports.checkUser(user_hash).then(user => ({notebook_list: user.notebook_list}));
  // },

  saveNotebook(user_hash, notebook_name) {
    return new Promise(((resolve, reject) => {
      const updateAll = (user_data, company_data) => {
        const {company_name, admin_hash} = company_data;

        const updates = {};

        // notebook
        const notebook_hash = admin.database().ref('NotebookList').push().key;

        const managers = {};
        managers[user_hash] = true;
        managers[admin_hash] = true;

        const isPublic = false;

        const notebook_update = new Notebook({
          notebook_hash,
          name: notebook_name,
          managers,
          isPublic,
        });
        updates[`/NotebookList/${notebook_hash}`] = notebook_update;

        // company
        updates[`/companies/${company_name}/notebooks/${notebook_hash}`] = true;

        // user
        const notebook_permission = {
          read: true,
          write: true,
          manager: true,
        };

        updates[`/UserList/${user_hash}/permissions/notebooks/${notebook_hash}`] = notebook_permission;
        updates[`/UserList/${admin_hash}/permissions/notebooks/${notebook_hash}`] = notebook_permission;

        admin.database().ref().update(updates)
          .then(() => {
            resolve(notebook_update);
          })
          .catch(reject);
      };

      const checkForPermission = (user_data) => {
        if (!user_data.permissions.create_notebooks) {
          return Promise.reject(new Error('Permission denied'));
        }

        return user_data;
      };

      const sendUpdateData = (user_data) => {
        const {company_name} = user_data;

        admin.database().ref(`companies/${company_name}`).once('value').then((snap) => {
          const company_data = snap.val();
          updateAll(user_data, company_data);
        });
      };

      module.exports.checkUser(user_hash)
        .then(checkForPermission)
        .then(sendUpdateData)
        .catch(reject);
    }));
  },

  addEntry(user_hash, notebook_hash, entry) {
    return new Promise(((resolve, reject) => {
      // if (!(type && data)) {
      //   reject(new Error('invalid request'));
      //   return;
      // }

      const updateAll = (user_data) => {
        const updates = {};

        const {email} = user_data;

        // notebook
        const now = new Date().getTime();
        const entry_hash = admin.database().ref('NotebookList').push().key;

        const tags = entry.tags || [];

        const entry_update = {
          entry_hash,
          author: email,
          author_hash: user_hash,
          date_modified: now,
          date_created: now,
          text: entry.text || null,
          image: entry.image || null,
          caption: entry.caption || null,
          tags,
        };
        updates[`/NotebookList/${notebook_hash}/data_entries/${entry_hash}`] = entry_update;

        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          updates[`/NotebookList/${notebook_hash}/tags/${tag}/${entry_hash}`] = true;
        }

        updates[`/NotebookList/${notebook_hash}/date_modified`] = now;

        admin.database().ref().update(updates)
          .then(() => {
            resolve(entry_update);
          })
          .catch(reject);
      };

      const checkForPermission = (user_data) => {
        let check = user_data;
        check = check.permissions || {};
        check = check.notebooks || {};
        check = check[notebook_hash] || {};
        check = !check.write;
        if (check) {
          return Promise.reject(new Error('Permission denied'));
        }

        return user_data;
      };

      module.exports.checkUser(user_hash)
        .then(checkForPermission)
        .then(updateAll)
        .catch(reject);
    }));
  },

  getEntries(user_hash, notebook_hash) {
    // NOTE does not check for permission
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value').then((snap) => {
      const notebook = snap.val();
      if (!notebook) {
        return Promise.reject(new Error('invalid request'));
      }

      const data_entries = notebook.data_entries || {};
      return Object.keys(data_entries);
    });
  },

  getEntry(user_hash, notebook_hash, entry_hash) {
    // NOTE does not check for permission
    const path = `/NotebookList/${notebook_hash}/data_entries/${entry_hash}/`;
    return admin.database().ref(path).once('value').then((snap) => {
      const entry = snap.val();
      if (!entry) {
        return Promise.reject(new Error('invalid request'));
      }

      return entry;
    });
  },

  managerView(user_hash) {
    return admin.database().ref(`/UserList/${user_hash}/Notebooks/`).once('value').then((snap) => { snap.val(); });
  },

  getNotebook(user_hash, notebook_hash) {
    // NOTE does not check for permission
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value').then((snap) => {
      const notebook = snap.val();
      if (!notebook) {
        return Promise.reject(new Error('Notebook not found'));
      }

      return notebook;
    });
  },

  getBackup(user_hash, notebook_hash) {
    // NOTE does not check for permission
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value').then((snap) => {
      const notebook = snap.val();
      if (!notebook) {
        return Promise.reject(new Error('Notebook not found'));
      }

      return CJSON.stringify(notebook);
    });
  },

  feedback(message) {
    const new_key = admin.database().ref('feedback').push().key;

    const updates = {};
    updates[`/feedback/${new_key}`] = message;

    if (sessionEmailCount < sessionEmailLimit) {
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'VENoteApp@gmail.com', // TODO replace personal gmail account
          pass: 'VENote2017',
        },
      });

      const mailOptions = {
        from: 'VENoteApp',
        to: 'jarett.lee.pi+response@gmail.com',
        subject: 'VENote feedback',
        text: message,
      };

      transport.sendMail(mailOptions, () => {});

      sessionEmailCount += 1;
    }

    return admin.database().ref().update(updates);
  },

  setNotebookPermissions(user_hash, notebook_hash, changes) {
    // NOTE does not check for permission
    const updates = {};

    const change_keys = Object.keys(changes);

    for (let i = 0; i < change_keys.length; i++) {
      const other_hash = change_keys[i];
      const change = changes[other_hash];

      console.log(other_hash, change);

      const path = `UserList/${other_hash}/permissions/notebooks/${notebook_hash}`;
      if (change) {
        updates[`${path}/read`] = change.read || false;
        updates[`${path}/write`] = change.write || false;
        updates[`${path}/manager`] = change.manager || false;

        if (change.manager) {
          updates[`/NotebookList/${notebook_hash}/managers/${other_hash}`] = true;
        } else {
          updates[`/NotebookList/${notebook_hash}/managers/${other_hash}`] = null;
        }
      } else {
        updates[`${path}`] = null;
        updates[`/NotebookList/${notebook_hash}/managers/${other_hash}`] = null;
      }
    }

    return admin.database().ref().update(updates);
  },

  getLink(user_hash, notebook_hash) {
    return admin.database().ref(`/NotebookList/${notebook_hash}/`).once('value')
      .then((snap) => {
        const notebook = snap.val();
        if (!notebook) {
          return Promise.reject(new Error('Notebook not found'));
        }

        const updates = {};
        updates[`/NotebookList/${notebook_hash}/isPublic`] = true;

        const p = admin.database().ref().update(updates).then(() => {
          const url = `http://endor-vm1.cs.purdue.edu/notebook/${notebook_hash}`;
          return {url};
        });

        return Promise.resolve(p);
      });
  },

  format(user_hash, notebook_hash, format) {
    // NOTE does not check for permission
    const updates = {};
    updates[`/NotebookList/${notebook_hash}/format`] = format;

    return admin.database().ref().update(updates);
  },

  cosignEntry(user_hash, notebook_hash, entry_hash) {
    return new Promise(((resolve, reject) => {
      let path = `/NotebookList/${notebook_hash}/data_entries/${entry_hash}/`;
      admin.database().ref(path).once('value').then((snap) => {
        const entry = snap.val();
        if (!entry) {
          reject(new Error('Entry not found'));
          return;
        }

        if (entry.cosign_hash) {
          reject(new Error('Entry already cosigned'));
          return;
        }

        path = `/UserList/${user_hash}`;
        admin.database().ref(`UserList/${user_hash}`).once('value').then((snap2) => {
          const user = snap2.val();
          if (!user) {
            reject(new Error('User not found'));
            return;
          }

          let next = user;
          next = next.permissions || {};
          next = next.notebooks || {};
          next = next[notebook_hash] || {};
          next = next.manager || false;
          const isManager = next;
          if (!isManager) {
            reject(new Error('Permission denied'));
            return;
          }

          const {email} = user;

          const updates = {};
          updates[`/NotebookList/${notebook_hash}/data_entries/${entry_hash}/cosign_email`] = email;
          updates[`/NotebookList/${notebook_hash}/data_entries/${entry_hash}/cosign_hash`] = user_hash;

          admin.database().ref().update(updates)
            .then(() => {
              resolve();
            })
            .catch(reject);
        });
      });
    }));
  },

  getCompanyUsers(user_hash) {
    // NOTE does not check for permission
    return new Promise((resolve, reject) => {
      const getCompanyUsers = (snap) => {
        const company = snap.val();

        const users = Object.keys(company.users || {});
        resolve({
          users,
        });
      };

      const getCompanyName = (snap) => {
        const user = snap.val();
        if (!user) {
          reject(new Error('invalid request'));
          return;
        }

        const {company_name} = user;

        admin.database().ref(`/companies/${company_name}`).once('value').then(getCompanyUsers, reject);
      };

      admin.database().ref(`/UserList/${user_hash}`).once('value').then(getCompanyName, reject);
    });
  },

  getCompanyUsersPermission(user_hash, notebook_hash) {
    // NOTE does not check for permission
    return new Promise((resolve, reject) => {
      const checkUsers = (company_name, users) => {
        const my_users = Object.assign({}, users);
        const entries = Object.entries(users);

        for (let i = 0; i < entries.length; i++) {
          const other_hash = entries[i][0];
          const user = entries[i][1];

          if (user.company_name !== company_name) {
            delete my_users[other_hash];
          } else {
            let next = user;
            next = next.permissions || {};
            next = next.notebooks || {};
            next = next[notebook_hash] || false;
            my_users[other_hash] = next;
          }
        }

        resolve(my_users);
      };

      const getUsers = (company_name) => {
        admin.database().ref('/UserList').once('value').then((snap) => {
          const users = snap.val() || {};

          checkUsers(company_name, users);
        });
      };

      const getCompanyName = (snap) => {
        const user = snap.val();
        if (!user) {
          return Promise.reject(new Error('invalid request'));
        }

        const {company_name} = user;
        return company_name;
      };

      admin.database().ref(`/UserList/${user_hash}`).once('value')
        .then(getCompanyName)
        .then(getUsers)
        .catch(reject);
    });
  },

  deleteCompany(company_name) {
    return admin.database().ref(`companies/${company_name}`).once('value').then((snap) => {
      const company = snap.val();
      if (!company) {
        return Promise.resolve();
      }

      let i;

      const updates = {};
      updates[`companies/${company_name}`] = null;

      const emails64 = company.emails64 || {};
      const users = company.users || {};
      const notebooks = company.notebooks || {};

      const emails64Keys = Object.keys(emails64);
      const usersKeys = Object.keys(users);
      const notebooksKeys = Object.keys(notebooks);

      for (i = 0; i < emails64Keys.length; i++) {
        const key = emails64Keys[i];

        updates[`login_info/${key}`] = null;
      }

      for (i = 0; i < usersKeys.length; i++) {
        const key = usersKeys[i];

        updates[`UserList/${key}`] = null;
      }

      for (i = 0; i < notebooksKeys.length; i++) {
        const key = notebooksKeys[i];

        updates[`NotebookList/${key}`] = null;
      }

      return admin.database().ref().update(updates).catch(() => {});
    })
      .catch(() => {});
  },
};
