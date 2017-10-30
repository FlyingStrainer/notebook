// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const FirebaseInit = require('./FirebaseInit.js');

// Setup
// const db = admin.database();
const router = express();
router.use(require('access-control')({
  maxAge: '8 hours',
  credentials: true,
}));

// Define the port to run on
router.set('port', 3000);

// Middleware
router.use(bodyParser.json());

// API
// TODO api is a mess

// writing
router.post('/savenotebook', (req, res) => {
  const {name} = req.body;
  FirebaseInit.saveNotebook(name);
  res.sendStatus(500);
  // res.sendStatus(201);
});

router.post('/addEntry', (req, res) => {
  // const {user_hash, notebook_uuid, entry} = req.body;
  const {user_hash, notebook_uuid} = req.body;
  FirebaseInit.addEntry(user_hash, notebook_uuid);
  res.sendStatus(500);
  // res.sendStatus(201);
});

router.post('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

// delete entry
router.post('/deleteEntry', (req, res) => {
  const {user_hash, notebook_uuid, entry_uuid} = req.body;
  FirebaseInit.deleteEntry(user_hash, notebook_uuid, entry_uuid);
  res.sendStatus(500);
  // res.sendStatus(201);
});

// reading
router.get('/getnotebooks', async (req, res) => {
  const {user_hash} = req.query;
  FirebaseInit.getNotebooks(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

// Listen for requests
const server = router.listen(router.get('port'), () => {
  const {port} = server.address();
  console.log(`Magic happens on port ${port}`);
});
