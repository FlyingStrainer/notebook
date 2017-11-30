// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebaseUtil = require('./firebase-util.js');

const {pdfgen, querydb} = firebaseUtil;

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

function addRoute(path, props, utilFunc, thenHandler, allowedErrors) {
  router.post(path, (req, res) => {
    const {body} = req;
    const args = [];
    const line = JSON.stringify(body).split('\n')[0].substr(0, 120);

    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (!(body[prop])) {
        console.log(`${path} bad:`, line);
        res.sendStatus(400);
        return;
      }
      args.push(body[prop]);
    }

    if (firebaseUtil.isTest) {
      res.status(204).send();
      return;
    }

    console.log(`${path} attempt:`, line);

    res.setHeader('Content-Type', 'application/json');

    firebaseUtil[utilFunc].apply(null, args)
      .then((data) => {
        const dataline = JSON.stringify(data).split('\n')[0].substr(0, 120);
        console.log(`${path} good:`, dataline);

        res.status(200).send(data);

        return data;
      })
      .catch((err) => {
        if (allowedErrors.includes(err.message)) {
          res.status(403).send({message: err.message});

          console.log(`${path} bad:`, err.message);
        } else {
          res.status(500).send({message: err.message});

          console.log(`${path} server failed:`, err.message);
        }

        return Promise.reject(err);
      })
      .then(thenHandler)
      .catch(() => {});
  });
}

(() => {
  const path = '/register';
  const props = ['email', 'password', 'company_name'];
  const utilFunc = 'createUser';
  const thenHandler = () => {};
  const allowedErrors = ['email already exists'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/login';
  const props = ['email', 'password'];
  const utilFunc = 'loginUser';
  const thenHandler = () => {};
  const allowedErrors = ['email not found', 'incorrect password'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/user';
  const props = ['user_hash'];
  const utilFunc = 'checkUser';
  const thenHandler = () => {};
  const allowedErrors = ['user not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/getNotebook';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = ''; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['notebook not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// writing
(() => {
  const path = '/addNotebook';
  const props = ['user_hash', 'name'];
  const utilFunc = 'saveNotebook';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  // const {user_hash, notebook_hash, entry} = req.body;
  // const {type} = entry;
  // const data = entry[type];
  //
  const path = '/addEntry';
  const props = ['user_hash', 'notebook_hash', 'entry'];
  const utilFunc = 'addEntry';
  const thenHandler = () => {};
  const allowedErrors = ['invalid request'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
  //
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
})();

(() => {
  const path = '/cosignEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = ''; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Cosign failed'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


// reading
(() => {
  const path = '/getEntries';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getEntries';
  const thenHandler = () => {};
  const allowedErrors = ['Retreval of entries failed'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/getEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = 'getEntry';
  const thenHandler = () => {};
  const allowedErrors = ['Entry not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// might need to filter/parse the data returned from this
router.post('/searchByText', async (req, res) => {
  const {user_hash, text} = req.body;

  if (!(user_hash)) {
    console.log('/searchText bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
  }


  querydb.indexEx.search({
    query: text,
  }).then((responses) => {
    // Response from Algolia:
    // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
    //res.send(responses.hits);
    var entryArr = [];
    var retCount = 0;
    var notebooksArr = [];
    for (var i = 0; i <responses.hits.length; i++ ) {
      notebooksArr[i] = response.hits[i].notebook_hash;

      for (var entry_hash in responses.hits[i].data_entires) {
        if (responses.hits[i].data_entires[entry_hash].text.indexOf(text) != -1){
         entryArr[retCount] = response.hits.data_entires[i].entry_hash;
         retCount++;
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({user_hash: user_hash, entry_hash: entryArr}));
  });
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

(() => {
  const path = '/managerView';
  const props = ['user_hash'];
  const utilFunc = 'managerView'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Esclation to manager view failed. Do you have permission?'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/getBackup';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getNotebook'; // TODO is this the right util function??
  const thenHandler = () => {};
  const allowedErrors = ['Backup for this notebook does not exist'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/feedback';
  const props = ['message'];
  const utilFunc = 'feeback'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to send feedback'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/setNotebookPermissions';
  const props = ['user_hash', 'notebook_hash']; // I assume we also need what we are changing the permissions to?
  const utilFunc = 'setNotebookPermissions'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to change permissions'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/getLink';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getLink'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to get Link. It\'s dangerous to go alone. Take this!\n:~{=======>'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

(() => {
  const path = '/format';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'format'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to format'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


router.get('/notebook/:notebook_hash', async (req, res) => {
  const {notebook_hash} = req.params;

  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(notebook);
  });
});


module.exports = router;
