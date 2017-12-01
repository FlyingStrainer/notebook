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
    const line = JSON.stringify(body).split('\n')[0].substr(0, 60);

    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (!(body[prop])) {
        console.log(`${path} bad:\t\t`, line);
        res.sendStatus(400);
        return;
      }
      args.push(body[prop]);
    }

    if (firebaseUtil.isTest) {
      res.status(204).send();
      return;
    }

    console.log(`${path} attempt:\t\t`, line);

    res.setHeader('Content-Type', 'application/json');

    if (!firebaseUtil[utilFunc]) {
      const message = 'not yet implemented';
      res.status(500).send({message});

      console.log(`${path} server failed:\t`, message);

      return;
    }

    firebaseUtil[utilFunc].apply(null, args)
      .then((data) => {
        if (data) {
          const dataline = JSON.stringify(data).split('\n')[0].substr(0, 60);
          console.log(`${path} good:\t\t`, dataline);

          res.status(200).send(data);

          return data;
        }

        console.log(`${path} good:\t\tno response`);
        res.status(204).send();
        return {};
      })
      .catch((err) => {
        if (allowedErrors.includes(err.message)) {
          res.status(403).send({message: err.message});

          console.log(`${path} bad:\t\t\t`, err.message);
        } else {
          res.status(500).send({message: err.message});

          console.log(`${path} server failed:\t`, err.message);
        }

        return Promise.reject(err);
      })
      .then(thenHandler)
      .catch(() => {});
  });
}

//Automated test: true
(() => {
  const path = '/register';
  const props = ['email', 'password', 'company_name'];
  const utilFunc = 'createUser';
  const thenHandler = () => {};
  const allowedErrors = ['email already exists'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/login';
  const props = ['email', 'password'];
  const utilFunc = 'loginUser';
  const thenHandler = () => {};
  const allowedErrors = ['email not found', 'incorrect password'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/user';
  const props = ['user_hash'];
  const utilFunc = 'checkUser';
  const thenHandler = () => {};
  const allowedErrors = ['user not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/getNotebook';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getNotebook';
  const thenHandler = () => {};
  const allowedErrors = ['notebook not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// writing

//Automated test: true
(() => {
  const path = '/addNotebook';
  const props = ['user_hash', 'name'];
  const utilFunc = 'saveNotebook';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
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

//Automated test: true
(() => {
  const path = '/cosignEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = 'cosignEntry';
  const thenHandler = () => {};
  const allowedErrors = ['Entry not found', 'Entry already cosigned', 'User not found', 'Permission denied'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


// reading

//Automated test: true
(() => {
  const path = '/getEntries';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getEntries';
  const thenHandler = () => {};
  const allowedErrors = ['Retreval of entries failed'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/getEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = 'getEntry';
  const thenHandler = () => {};
  const allowedErrors = ['Entry not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
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
    // res.send(responses.hits);
    const returnArr = [];
    console.log(responses.hits);

    for (let i = 0; i < responses.hits.length; i++) {
      // console.log(Object.values(responses.hits[i].data_entries));


      returnArr[i] = {notebook: responses.hits[i].notebook_hash, entries: []};

      // firebaseUtil.checkNotebookPermission(user_hash, notebooksArr[i], "read").then((data) => {
      // });

      if (responses.hits[i].data_entries === undefined || responses.hits[i].data_entries === null) {
        continue;
      }
      
      for (let j = 0; j < Object.values(responses.hits[i].data_entries).length; j++) {
        const dataentry = Object.values(responses.hits[i].data_entries)[j];
        // console.log("OUT:" + dataentry);
        if (dataentry.text.indexOf(text) !== -1) {
          returnArr[i].entries.push(dataentry.entry_hash);
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
  });
});

//Automated test: true
router.post('/searchNotebooksByDate', async (req, res) => {
  const {user_hash, mindate, maxdate} = req.body;

  if (!(user_hash)) {
    console.log('/searchByDate bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
  }


  querydb.indexEx.search({
    filters: `date_created <=${maxdate} AND date_created >=${mindate}`,
  }).then((responses) => {
    // Response from Algolia:
    // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
    // res.send(responses.hits);

    const returnArr = [];
    console.log(responses.hits);

    for (let i = 0; i < responses.hits.length; i++) {
      // console.log(Object.values(responses.hits[i].data_entries));


      returnArr[i] = {notebook: responses.hits[i].notebook_hash, entries: []};

      // firebaseUtil.checkNotebookPermission(user_hash, notebooksArr[i], "read").then((data) => {
      // });
      if (responses.hits[i].data_entries === undefined || responses.hits[i].data_entries === null) {
        continue;
      }
      for (let j = 0; j < Object.values(responses.hits[i].data_entries).length; j++) {
        const dataentry = Object.values(responses.hits[i].data_entries)[j];
        // console.log("OUT:" + dataentry);
        if (dataentry.date_modified <= maxdate && dataentry.date_modified >= mindate) {
          returnArr[i].entries.push(dataentry.entry_hash);
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
  });
});

//Automated test: true
router.post('/makePDF', async (req, res) => {
  const {notebook_hash} = req.body;

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
  // `${req.protocol}://${req.get('host')}${req.path}/${pdfname}.pdf`}
  // res.status(200).send(JSON.stringify({url: req.protocol}));
  // console.log(notebook_hash);

  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    console.log(`TEST:${notebook.data_entries}`);
    const pdfarray = Object.values(notebook.data_entries);
    const pdfname = notebook.name;
    pdfgen.genPDF(pdfarray, pdfname, 'server');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({url: `${req.protocol}://${req.get('host')}/pdfdisp/${pdfname}.pdf`}));
  });
  // var pdfname = "fsda";


  // old: await db.ref(`words/${userId}`).once('value');
});

//Automated test: true
(() => {
  const path = '/managerView';
  const props = ['user_hash'];
  const utilFunc = 'managerView'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Esclation to manager view failed. Do you have permission?'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/getBackup';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getNotebook'; // TODO is this the right util function??
  const thenHandler = () => {};
  const allowedErrors = ['Backup for this notebook does not exist'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/feedback';
  const props = ['message'];
  const utilFunc = 'feedback'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to send feedback'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/setNotebookPermissions';
  const props = ['user_hash', 'notebook_hash', 'changes'];
  const utilFunc = 'setNotebookPermissions';
  const thenHandler = () => {};
  const allowedErrors = ['Failed to change permissions'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/getLink';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getLink'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to get Link. It\'s dangerous to go alone. Take this!\n:~{=======>'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: true
(() => {
  const path = '/format';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'format'; // TODO
  const thenHandler = () => {};
  const allowedErrors = ['Failed to format'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


//Automated test: true, needs work
router.get('/notebook/:notebook_hash', async (req, res) => {
  const {notebook_hash} = req.params;

  const allowedErrors = ['notebook not found', 'Notebook not public'];

  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    if (!notebook.public) {
      return Promise.reject(new Error('Notebook not public'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(notebook, null, 4));

    return Promise.resolve();
  }).catch((err) => {
    if (allowedErrors.includes(err.message)) {
      console.log(`${req.path} bad:\t\t\t`, err.message);
    } else {
      console.log(`${req.path} server failed:\t`, err.message);
    }

    res.status(404).send('Access denied');
  });
});

router.get('/pdfdisp/:pdfname', (req, res) => {
  const {pdfname} = req.params;
  console.log(req.params);
  const file = `./genPDFs/${pdfname}`;
  res.download(file); // Set disposition and send it.
});

//Automated test: false
(() => {
  const path = '/getCompanyUsers';
  const props = ['user_hash'];
  const utilFunc = 'getCompanyUsers';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

//Automated test: false
(() => {
  const path = '/getCompanyUsersPermission';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getCompanyUsersPermission';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

module.exports = router;
