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
  console.log('req: /user');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    user_hash: 'user_hash1',
    company_name: 'company1',
    notebooks: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
    role: 'user',

    key: '--user-key-1',
    companyName: 'company1',
    roleList: {
      user: true,
    },
    notebookList: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
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
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify({
    dataEntryList: [
      '--data-entry-key-1',
      '--data-entry-key-2',
    ],
  }));
});

router.get('/getEntry', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const obj = {
    key: '--data-entry-key-1',
    author: '--user-key-2',
    cosignedBy: false,
    dateModified: new Date('2017-01-02').toJSON(),
    dateCreated: new Date('2017-01-02').toJSON(),
    tagList: {
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
  console.log('req: /getNotebooks');

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    notebooks: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
  }));
});

router.post('/getNotebook', (req, res) => {
  console.log('req: /getNotebook');
  const {notebook_hash} = req.body;

  res.setHeader('Content-Type', 'application/json');
  if (notebook_hash == '--notebook-key-1') {
    res.send(JSON.stringify({
      uuid: '--notebook-key-1',
      managers: [
        '--manager-key-1',
        '--manager-key-2',
      ],
      date_modified: new Date('2017-01-03').toJSON(),
      date_created: new Date('2017-01-01').toJSON(),
      tags: {
        'tag-1': [
          '--data-entry-key-1',
          '--data-entry-key-2',
        ],
        'tag-2': [
          '--data-entry-key-2',
        ],
      },
      permisions: { 'user': true },

      key: '--notebook-key-1',
      name: 'Notebook 1',
      managerList: [
        '--manager-key-1',
        '--manager-key-2',
      ],
      dateModified: new Date('2017-01-03').toJSON(),
      dateCreated: new Date('2017-01-01').toJSON(),
      tagList: {
        'tag-1': [
          '--data-entry-key-1',
          '--data-entry-key-2',
        ],
        'tag-2': [
          '--data-entry-key-2',
        ],
      },
      permisions: {
        'read': true,
        'write': true,
      },
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
    res.send(JSON.stringify({
      uuid: '--notebook-key-2',
      managers: [
        '--manager-key-2',
      ],
      date_modified: new Date('2017-02-03').toJSON(),
      date_created: new Date('2017-02-01').toJSON(),
      tags: [
        'tag-2': [
          '--data-entry-key-2',
        ],
      ],
      permisions: { 'user': true },

      key: '--notebook-key-2',
      name: 'Notebook 2',
      managerList: [
        '--manager-key-2',
      ],
      dateModified: new Date('2017-02-03').toJSON(),
      dateCreated: new Date('2017-02-01').toJSON(),
      tagList: [
        'tag-2': [
          '--data-entry-key-2',
        ],
      ],
      permisions: {
        'read': true,
        'write': true,
      },
    }));
  }
});

module.exports = router;
