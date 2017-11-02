// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./firebase-util.js');
const Notebook = require('./objects/Notebook');

// Setup
// const db = admin.database();
const router = express();
router.use(require('access-control')({
  maxAge: '8 hours',
  credentials: true,
}));

// Define the port to run on
router.set('port', 80);

// Middleware
router.use(bodyParser.json());

// API
// TODO api is a mess

router.post('/user', (req, res) => {
  console.log('req');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    user_hash: 'user_hash1',
    company_name: 'company1',
    notebooks: [
      'notebookhash1',
      'notebookhash2',
    ],
    role: 'user',
  }), null, 3);
});

// writing
router.post('/saveNotebook', (req, res) => {
  const {name} = req.body;
  firebase.saveNotebook(name);
  res.sendStatus(500);
  // res.sendStatus(201);
});

router.post('/addEntry', (req, res) => {
  // const {user_hash, notebook_uuid, entry} = req.body;
  const {user_hash, notebook_uuid} = req.body;
  firebase.addEntry(user_hash, notebook_uuid);
  res.sendStatus(500);
  // res.sendStatus(201);
});

router.post('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

// delete entry
/*
router.post('/deleteEntry', (req, res) => {
  const {user_hash, notebook_uuid, entry_uuid} = req.body;
  firebase.deleteEntry(user_hash, notebook_uuid, entry_uuid);
  res.sendStatus(500);
  // res.sendStatus(201);
});
*/

// reading
router.get('/getEntries', async (req, res) => {
  const {user_hash} = req.query;
  firebase.getEntries(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

router.post('/getNotebooks', (req, res) => {
  console.log('req: /getNotebooks');

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    notebooks: [
      'notebookhash1',
      'notebookhash2',
    ],
  }));
});

router.post('/getNotebook', (req, res) => {
  console.log('req: /getNotebook');
  const {notebook_hash} = req.body;

  res.setHeader('Content-Type', 'application/json');
  if (notebook_hash == 'notebookhash1') {
    res.send(JSON.stringify({
      uuid: notebook_hash,
      name: 'notebook name 1',
      managers: [ 'manager1' ],
      date_modified: new Date(),
      date_created: new Date(),
      tags: [ 'tag1' ],
      permisions: { 'user': true },
    }));
  }
  else {
    res.send(JSON.stringify({
      uuid: notebook_hash,
      name: 'notebook name 2',
      managers: [ 'manager2' ],
      date_modified: new Date(),
      date_created: new Date(),
      tags: [ 'tag1', 'tag2' ],
      permisions: { 'user': true },
    }));
  }
});

module.exports = router;
