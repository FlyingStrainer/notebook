
const admin = require('firebase-admin');
const serviceAccount = require('../../testServiceAccountKey.json');

admin.isMock = () => true;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://notebook-bb3a8.firebaseio.com',
});
admin.initializeApp = () => {};

module.exports = admin;
