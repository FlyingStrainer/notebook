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

const websocket = require('./websocket.js')(router);

// API

//writing
router.post('/savenotebook', (req, res) => {
  console.log('post request /savenotebook');
  const {user_hash, name} = req.body;
  var generatedUUID = new Date().getTime();
  // FirebaseInit.savenotebook(name, generatedUUID, user_hash), error => {
  var v = FirebaseInit.savenotebook(name, user_hash);

  // res.end(JSON.stringify(v, null, 2));
  res.sendStatus(201);
});

router.post('/addEntry', (req, res) => {
  ({user_hash, notebook_uuid, entry} = req.body);
  var value = FirebaseInit.addentry(user_hash, notebook_uuid, entry);
  res.sendStatus(201);
});

router.post('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

//delete entry
router.post('/deleteentry', (req, res) => {
  const {user_hash, notebook_uuid, entry_uuid} = req.body;
  FirebaseInit.deleteentry(user_hash, notebook_uuid, entry_uuid);
  res.sendStatus(201);
});

//reading
router.get('/getnotebooks', async (req, res) => {
  const {user_hash} = req.query;
  FirebaseInit.getNotebooks(user_hash, function (snapshot) {
    const response = Object.assign({}, snapshot.val()); //This is done so that if the user does not exist, a empty obj is returned
    res.send(response);
  });//old: await db.ref(`words/${userId}`).once('value');

});

// Listen for requests
var server = router.listen(router.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
