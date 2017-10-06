// Dependencies
const admin = require('firebase-admin');
const express = require('express');
var FirebaseInit = require('./Firebaseinit.js');

// Setup
const db = admin.database();
const router = express.Router();

// Middleware
router.use(bodyParser.json());

// API

//writing
router.post('/savenotebook', (req, res) => {
  const {user_hash, name} = req.body;
  FirebaseInit.creatNotebook(name, generatedUUID, user_hash), error => {
    if (error) {
      res.sendStatus(500);
      // Log error to external service, e.g. Sentry
    } else {
      res.sendStatus(201);
    }
  };
});

router.post('/addEntry', (req, res) => {
  const {user_hash, notebook_uuid, entry{uuid, text, image, caption, date_created, author_id}} = req.body;
  FirebaseInit.addNotebookEntry(entry, notebook_uuid, user_hash), error => {
    if (error) {
      res.sendStatus(500);
      //log error to extern service
    }else {
      res.sendStatus(201);
    }
  };
});



//reading
router.get('/getnotebooks', async (req, res) => {
  const {user_hash} = req.query;
  const wordsSnapshot = FirebaseInit.getNotebooks(user_hash)//old: await db.ref(`words/${userId}`).once('value');
  const response = Object.assign({}, wordsSnapshot.val());
  res.send(response);
});
