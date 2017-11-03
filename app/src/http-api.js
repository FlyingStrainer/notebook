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

router.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!(email && password)) {
    console.log('/login bad', req.body);
    res.sendStatus(400);
    return;
  }

  console.log('/login good');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    user_hash:'--user-key-1',
  }));
});

router.post('/register', (req, res) => {
  const {email, password, company_name} = req.body;

  if (!(email && password && company_name)) {
    console.log('/register bad', req.body);
    res.sendStatus(400);
    return;
  }

  console.log('/register good');
  // res.send(JSON.stringify('--user-key-1'));
  res.sendStatus(201);
});

router.post('/user', (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/user bad', req.body);
    res.sendStatus(400);
    return;
  }

  console.log('/user good');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    user_hash: '--user-key-1',
    company_name: 'company1',
    notebooks: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
    roles: {
      user: true,
    },
  }), null, 3);
});

// writing
router.post('/addNotebook', (req, res) => {
  const {user_hash, name} = req.body;

  if (!(user_hash && name)) {
    console.log('/addNotebook bad', req.body);
    res.sendStatus(400);
    return;
  }

  console.log('/addNotebook good');
  res.sendStatus(201);
});

router.post('/addEntry', (req, res) => {
  const {user_hash, notebook_uuid, entry} = req.body;
  const {type} = entry;
  const data = entry[type];

  if (!(user_hash && notebook_uuid && entry && type && data)) {
    console.log('/addEntry bad', req.body);
    res.sendStatus(400)
    return;
  }

  console.log('/addEntry good');
  res.sendStatus(201);
});

router.post('/cosignEntry', (req, res) => {
  const {user_hash, notebook_uuid, entry_uuid} = req.body;

  if (!(user_hash && notebook_uuid && entry_uuid)) {
    console.log('/cosignEntry bad', req.body);
    res.sendStatus(400)
    return;
  }

  console.log('/cosignEntry good');
  res.sendStatus(201);
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
  const {user_hash, notebook_uuid} = req.body;

  if (!(user_hash && notebook_uuid)) {
    console.log('/getEntries bad', req.body);
    res.sendStatus(400)
    return;
  }

  console.log('/getEntries good');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    data_entries: [
      '--data-entry-key-1',
      '--data-entry-key-2',
    ],
  }));
});

router.get('/getEntry', async (req, res) => {
  const {user_hash, notebook_uuid, entry_uuid} = req.body;

  if (!(user_hash && notebook_uuid && entry_uuid)) {
    console.log('/getEntry bad', req.body);
    res.sendStatus(400)
    return;
  }

  console.log('/getEntry good');
  res.setHeader('Content-Type', 'application/json');
  const obj = {
    key: '--data-entry-key-1',
    author: '--user-key-2',
    cosigned_by: false,
    date_modified: new Date('2017-01-02').toJSON(),
    date_created: new Date('2017-01-02').toJSON(),
    tags: {
      'tag-1': true,
    },
    type: 'text',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
      'sed do eiusmod tempor incididunt ut labore et dolore magna ali' +
      'qua. Ut enim ad minim veniam, quis nostrud exercitation ullamc' +
      'o laboris nisi ut aliquip ex ea commodo consequat. Duis aute i' +
      'rure dolor in reprehenderit in voluptate velit esse cillum dol' +
      'ore eu fugiat nulla pariatur. Excepteur sint occaecat cupidata' +
      't non proident, sunt in culpa qui officia deserunt mollit anim' +
      ' id est laborum.',
  }
  res.send(JSON.stringify(obj));
});

router.post('/getNotebooks', (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body, req);
    res.sendStatus(400);
    return;
  }

  console.log('/getNotebooks good');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    notebooks: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
  }));
});

router.post('/getNotebook', (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  if (!(user_hash, notebook_hash)) {
    console.log('/getNotebook bad', req.body, req);
    res.sendStatus(400);
    return;
  }

  console.log('/getNotebook good');
  res.setHeader('Content-Type', 'application/json');
  if (notebook_hash == '--notebook-key-1') {
    res.send(JSON.stringify({
      uuid: '--notebook-key-1',
      name: 'Notebook 1',
      managers: [
        '--manager-key-1',
        '--manager-key-2',
      ],
      date_modified: new Date('2017-01-03').toJSON(),
      date_created: new Date('2017-01-01').toJSON(),
      tags: [
        'tag-1',
        'tag-2',
      ],
      permisions: {
        'read': true,
        'write': true,
      },
    }));
  }
  else {
    res.send(JSON.stringify({
      uuid: '--notebook-key-2',
      name: 'Notebook 2',
      managers: [
        '--manager-key-1',
        '--manager-key-2',
      ],
      date_modified: new Date('2017-02-04').toJSON(),
      date_created: new Date('2017-02-02').toJSON(),
      tags: [
        'tag-1',
        'tag-2',
      ],
      permisions: {
        'read': true,
        'write': true,
      },
    }));
  }
});

module.exports = router;
