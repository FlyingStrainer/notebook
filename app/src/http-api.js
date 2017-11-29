// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebaseUtil = require('./firebase-util.js');
const pdfgen = require('./PDFGen.js');
// const querydb = require('./querydb.js');
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
  }

  // TODO get user_hash for key
  // firebaseUtil.loginUser(user_hash, (snapshot) => {
  //   // This is done so that if the user does not exist, a empty obj is returned
  //   const data = Object.assign({}, snapshot.val());
  //   res.send(data);
  //   console.log('/login good: ', data);
  //   // res.send(JSON.stringify(data));
  // });
});


router.post('/getNotebooks', async (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  firebaseUtil.getNotebooks(user_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

router.post('/getNotebook', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  if (!(user_hash && notebook_hash)) {
    console.log('/getNotebook bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
  }

  // TODO
});

router.post('/register', (req, res) => {
  const {email, password, company_name} = req.body;

  if (!(email && password && company_name)) {
    console.log('/register bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO actually create user
  console.log('/register good');
  firebaseUtil.createUser(email, password, company_name).then((data) => {
    res.sendStatus(200);
  });
});

router.post('/user', (req, res) => {
  const {user_hash} = req.body;

  if (!(user_hash)) {
    console.log('/user bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
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
  firebaseUtil.checkUser(user_hash, (snapshot) => {
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  // TODO verify saveNotebook works
  firebaseUtil.saveNotebook(user_hash, name).then(() => {
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  // TODO add entry to notebook
  // NOTE the addEntry function here does not match the true api
  //
  // firebaseUtil.addEntry(notebook_uuid, _text, _image,
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
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

  firebaseUtil.getEntries(user_hash, notebook_hash, (snapshot) => {
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

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  // TODO verify this works

  firebaseUtil.getEntry(user_hash, notebook_hash, entry_hash, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());

    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

// might need to filter/parse the data returned from this
router.post('/searchText', async (req, res) => {
  const {user_hash, text} = req.body;

  if (!(user_hash)) {
    console.log('/searchText bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
  }

  // TODO add this back in before finishing
  // querydb.indexEx.search({
  //   query,
  // }).then((responses) => {
  //   // Response from Algolia:
  //   // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
  //   res.send(responses.hits);
  // });
});

router.post('/makePDF', async (req, res) => {
  const {pdfarray, filename, location} = req.body;

  // TODO determine error conditions for PDF generation
  /* if (!(user_hash)) {
    console.log('/getNotebooks bad', req.body);
    res.sendStatus(400);
    return;
  } */

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  pdfgen.genPDF(pdfarray, filename, location, (snapshot) => {
    // This is done so that if the user does not exist, a empty obj is returned
    const response = Object.assign({}, snapshot.val());
    res.send(response);
  });// old: await db.ref(`words/${userId}`).once('value');
});

router.post('/managerView', async (req, res) => {
  const {user_hash} = req.body;

  // TODO check for all options
  if (!(user_hash)) {
    console.log('/getLink bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  firebaseUtil.managerView(user_hash);
});

router.post('/getBackup', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  // TODO check for all options
  if (!(user_hash && notebook_hash)) {
    console.log('/getLink bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  firebaseUtil.getNotebook(user_hash);
});

router.post('/feedback', async (req, res) => {
  const {message} = req.body;

  // TODO check for all options
  if (!(message)) {
    console.log('/getLink bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  // Given that I submit the feedback, it will send a message from the user to our emails
  firebaseUtil.feedback(message);
});

router.post('/setNotebookPermisions', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  // TODO check for all options
  if (!(user_hash && notebook_hash)) {
    console.log('/getLink bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  firebaseUtil.setNotebookPermisions(user_hash, notebook_hash);
});

router.post('/getLink', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  // TODO check for all options
  if (!(user_hash && notebook_hash)) {
    console.log('/getLink bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  firebaseUtil.getLink(user_hash, notebook_hash);
});

router.post('/format', async (req, res) => {
  const {user_hash, notebook_hash} = req.body;

  // TODO check for formatting options
  if (!(user_hash && notebook_hash)) {
    console.log('/format bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(501).send();
    return;
  }

  // TODO
  firebaseUtil.format(user_hash, notebook_hash);
});

router.get('/notebook/:notebook_hash', async (req, res) => {
  const {notebook_hash} = req.params;

  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(notebook);
  });
});

module.exports = router;
