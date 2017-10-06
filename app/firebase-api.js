// Dependencies
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
var FirebaseInit = require('./FirebaseInit.js');

// Setup
const db = admin.database();
const router = express();

// Define the port to run on
router.set('port', 3000);

// Middleware
router.use(bodyParser.json());

// API

//writing
router.post('/savenotebook', (req, res) => {
  const {user_hash, name} = req.body;
  FirebaseInit.createNotebook(name, generatedUUID, user_hash), error => {
    if (error) {
      res.sendStatus(500);
      // Log error to external service, e.g. Sentry
    } else {
      res.sendStatus(201);
    }
  };
});

router.post('/addEntry', (req, res) => {
  ({user_hash, notebook_uuid, nodebooks /*{ entry { uuid, text, image, caption, date_created, author_id}}*/} = req.body);
  FirebaseInit.addNotebookEntry(entry, notebook_uuid, user_hash), error => {
    if (error) {
      res.sendStatus(500);
      //log error to extern service
    }else {
      res.sendStatus(201);
    }
  };
});

router.post('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

//reading
router.get('/getnotebooks', async (req, res) => {
  const {user_hash} = req.query;
  const wordsSnapshot = FirebaseInit.getNotebooks(user_hash)//old: await db.ref(`words/${userId}`).once('value');
  const response = Object.assign({}, wordsSnapshot.val());
  res.send(response);
});

// Listen for requests
var server = router.listen(router.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
