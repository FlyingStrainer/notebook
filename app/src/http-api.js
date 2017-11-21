// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./firebase-util.js');
const pdfgen = require('./PDFGen.js');

// Setup
// const db = admin.database();
const router = express();
router.use(require('access-control')({
  maxAge: '8 hours',
  credentials: true,
}));

// Middleware
router.use(bodyParser.json());

// API

// TODO stretch: api

// TODO add account api

router.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!(email && password)) {
    console.log('/login bad', req.body);
    res.sendStatus(400);
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  // TODO get user_hash for key
  firebase.loginUser(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const data = Object.assign({}, snapshot.val());
    res.send(data);
    console.log('/login good: ', data);
    // res.send(JSON.stringify(data));
  });
});


router.post('/getNotebooks', async (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body);
    res.sendStatus(400);
    return;
  }

  firebase.getNotebooks(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

router.post('/register', (req, res) => {
  const {email, password, company_name} = req.body;

  if (!(email && password && company_name)) {
    console.log('/register bad', req.body);
    res.sendStatus(400);
    return;
  }

  // TODO actually create user
  console.log('/register good');
  res.sendStatus(201);
});

router.post('/user', (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/user bad', req.body);
    res.sendStatus(400);
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  /*
  const example = {
    company_name: 'company1',
    notebooks: [
      '--notebook-key-1',
      '--notebook-key-2',
    ],
    roles: (user|manager),
  };
  */
  firebase.checkUser(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const data = Object.assign({}, snapshot.val());
    res.send(data);
    console.log('/user good: ', data);
    // res.send(JSON.stringify(data));
  });
  // TODO get data in example
});

// writing
router.post('/addNotebook', (req, res) => {
  const {user_hash, name} = req.body;

  if (!(user_hash && name)) {
    console.log('/addNotebook bad', req.body);
    // bad request
    res.sendStatus(400);
    return;
  }

  // TODO verify saveNotebook works
  firebase.saveNotebook(user_hash, name).then(() => {
    console.log('/addNotebook good');
    res.sendStatus(201);
  }).catch(() => {
    console.log('/addNotebook internal bad');
    res.sendStatus(500);
  });
});

router.post('/addEntry', (req, res) => {
  const {user_hash, notebook_hash, entry} = req.body;
  const {type} = entry;
  const data = entry[type];

  if (!(user_hash && notebook_hash && entry && type && data)) {
    console.log('/addEntry bad', req.body);
    // bad request
    res.sendStatus(400);
    return;
  }

  // TODO add entry to notebook
  // NOTE the addEntry function here does not match the true api
  //
  // firebase.addEntry(notebook_uuid, _text, _image,
  //   _caption, _date_created, _authorID, _tag_arr).then(() => {
  //   console.log('/addEntry good');
  //   res.sendStatus(201);
  // }).catch(() => {
  //   console.log('/addEntry internal bad');
  //   res.sendStatus(500);
  // });
  console.log('/addEntry internal bad');
  res.sendStatus(500);
});

router.post('/cosignEntry', (req, res) => {
  const {user_hash, notebook_hash, entry_hash} = req.body;

  if (!(user_hash && notebook_hash && entry_hash)) {
    console.log('/cosignEntry bad', req.body);
    res.sendStatus(400);
    return;
  }

  // TODO actuall cosign entry
  console.log('/cosignEntry good');
  res.sendStatus(201);
});

// reading
router.post('/getEntries', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  if (!(user_hash && notebook_hash)) {
    console.log('/getEntries bad', req.body);
    res.sendStatus(400);
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  // const example = {
  //   data_entries: [
  //     '--data-entry-key-1',
  //     '--data-entry-key-2',
  //   ],
  // };

  // TODO verify this works

  firebase.getEntries(user_hash, notebook_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    console.log('/getEntries good: ', response);
    res.send(response);
  });
});

router.post('/getEntry', async (req, res) => {
  const {user_hash, notebook_hash, entry_hash} = req.body;

  if (!(user_hash && notebook_hash && entry_hash)) {
    console.log('/getEntry bad', req.body);
    res.sendStatus(400);
    return;
  }

  // TODO verify this works

  firebase.getEntry(user_hash, notebook_hash, entry_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});


router.post('/getNotebooks', async (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body);
    res.sendStatus(400);
    return;
  }

  firebase.getNotebooks(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

router.post('/makePDF', async (req, res) => {
  const {pdfarray, filename, location} = req.body;

  // TODO determine error conditions for PDF generation
  /* if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body);
    res.sendStatus(400);
    return;
  } */

  pdfgen.genPDF(pdfarray, filename, location, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());
    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

module.exports = router;
