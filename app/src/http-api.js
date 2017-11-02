// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./firebase-util.js');

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
router.post('/saveNotebook', (req, res) => {
  const {user_hash, name} = req.body;
  
  firebase.saveNotebook(user_hash, name).then(() => {
    res.sendStatus(201);
  }).catch((err) => {
    res.sendStatus(500);
  });
});

router.post('/addEntry', (req, res) => {
  // const {user_hash, notebook_uuid, entry} = req.body;
  const {user_hash, notebook_uuid} = req.body;
  firebase.addEntry(user_hash, notebook_uuid).then(() => {
    res.sendStatus(201);
  }).catch(() => {
    res.sendStatus(500);
  });
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

router.get('/getNotebooks', async (req, res) => {
  const {user_hash} = req.query;
  firebase.getNotebooks(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

module.exports = router;
