// Dependencies
// const admin = require('firebase-admin');

// 'use strict'; //For CORS access-control module?
// var access = require('access-control');
const express = require('express');
const bodyParser = require('body-parser');
const firebaseUtil = require('./firebase-util.js');
const PDFImage = require('pdf-image').PDFImage;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const {pdfgen} = firebaseUtil;

// Setup
// const db = admin.database();
const router = express();
router.use(require('access-control')({
  maxAge: '8 hours',
  credentials: true,
}));

router.get('/', (req, res) => {
  res.redirect('/index.html');
});
router.use('/index.html', express.static(path.resolve(__dirname, '../public')));
router.use('/favicon.ico', express.static(path.resolve(__dirname, '../public')));
router.use('/manifest.json', express.static(path.resolve(__dirname, '../public')));
router.use('/images', express.static(path.resolve(__dirname, '../public/images')));
router.use('/javascripts', express.static(path.resolve(__dirname, '../public/javascripts')));
router.use('/stylesheets', express.static(path.resolve(__dirname, '../public/stylesheets')));

// Middleware
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

// Automated test: true
(() => {
  const path = '/register';
  const props = ['email', 'password', 'company_name'];
  const utilFunc = 'createUser';
  const thenHandler = () => {};
  const allowedErrors = ['email already exists'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/login';
  const props = ['email', 'password'];
  const utilFunc = 'loginUser';
  const thenHandler = () => {};
  const allowedErrors = ['email not found', 'incorrect password'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/user';
  const props = ['user_hash'];
  const utilFunc = 'checkUser';
  const thenHandler = () => {};
  const allowedErrors = ['user not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/getNotebook';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getNotebook';
  const thenHandler = () => {};
  const allowedErrors = ['Notebook not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// writing

// Automated test: true
(() => {
  const path = '/addNotebook';
  const props = ['user_hash', 'name'];
  const utilFunc = 'saveNotebook';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
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
})();

// Automated test: true
(() => {
  const path = '/cosignEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = 'cosignEntry';
  const thenHandler = () => {};
  const allowedErrors = ['Entry not found', 'Entry already cosigned', 'User not found', 'Permission denied'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


// reading

// Automated test: true
(() => {
  const path = '/getEntries';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getEntries';
  const thenHandler = () => {};
  const allowedErrors = ['Retreval of entries failed'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/getEntry';
  const props = ['user_hash', 'notebook_hash', 'entry_hash'];
  const utilFunc = 'getEntry';
  const thenHandler = () => {};
  const allowedErrors = ['Entry not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
// might need to filter/parse the data returned from this
router.post('/searchByText', async (req, res) => {
  const {user_hash, text, notebook_hash} = req.body;

  if (!(user_hash)) {
    console.log('/searchText bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  const returnArr = [];


  firebaseUtil.getNotebooks(user_hash).then((responses) => {
    let numNotebooks = responses.notebook_list.length;
    //console.log(numNotebooks);

    if (notebook_hash !== undefined) {
      if (responses.notebook_list.includes(notebook_hash)) { numNotebooks = 1; } else {
        res.sendStatus(400);
        return;
      }
    }
    for (let i = 0; i < numNotebooks; i++) {
      let currNb = responses.notebook_list[i];
      if (notebook_hash !== undefined) currNb = notebook_hash;
      console.log(currNb);
      firebaseUtil.getNotebook('admin', currNb).then((notebook) => {
        // console.log(Object.keys(notebook.data_entries).length);
        if (notebook.data_entries !== undefined) {
          const numEntries = Object.keys(notebook.data_entries).length;
          console.log(numEntries);
          const currResult = {notebook: 'null', entries: []};
          for (let j = 0; j < numEntries; j++) {
            const dataentry = Object.values(notebook.data_entries)[j];
            const searchText = dataentry.text.toLowerCase();
            
            //console.log(`${searchFor} || ${searchText}|| ${searchText.indexOf(searchFor)}`);

            const searchFor = text.toLowerCase();
            if (searchText.indexOf(searchFor) !== -1) {
              if (currResult.notebook === 'null') currResult.notebook = notebook.notebook_hash;
              currResult.entries.push(dataentry.entry_hash);
            }

            if (j === numEntries - 1) {
              if (currResult.notebook !== 'null') returnArr.push(currResult);
              if (i === numNotebooks - 1) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
              }
            }
          }
        }

        else if (i === numNotebooks - 1) {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
        }
      });
    }
  });

  //console.log(returnArr);
});
router.post('/searchByTag', async (req, res) => {
  const {user_hash, tag, notebook_hash} = req.body;

  if (!(user_hash)) {
    console.log('/searchByTag bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  const returnArr = [];

  firebaseUtil.getNotebooks(user_hash).then((responses) => {
    let numNotebooks = responses.notebook_list.length;
    //console.log(numNotebooks);

    if (notebook_hash !== undefined) {
      if (responses.notebook_list.includes(notebook_hash)) { numNotebooks = 1; } else {
        res.sendStatus(400);
        return;
      }
    }
    for (let i = 0; i < numNotebooks; i++) {
      let currNb = responses.notebook_list[i];
      if (notebook_hash !== undefined) currNb = notebook_hash;
      firebaseUtil.getNotebook('admin', currNb).then((notebook) => {
        // console.log(Object.keys(notebook.data_entries).length);
        //console.log(Object.keys(notebook.tags)[0]);
        if (notebook.data_entries !== undefined && notebook.tags !== undefined) {
          const numEntries = Object.keys(notebook.data_entries).length;
          const currResult = {notebook: 'null', entries: []};
          for (let j = 0; j < numEntries; j++) {
            const dataentry = Object.values(notebook.data_entries)[j];
            const tags = dataentry.tags;
            let allCheck = 0;
            for (let k = 0; k <tag.length; k++) {
              if (tags.includes(tag[k])) allCheck++;
            }
            if (allCheck===tag.length) {
              if (currResult.notebook === 'null') currResult.notebook = notebook.notebook_hash;
              currResult.entries.push(dataentry.entry_hash);
            }

            if (j === numEntries - 1) {
              if (currResult.notebook !== 'null') returnArr.push(currResult);
              if (i === numNotebooks - 1) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
              }
            }
          }
        }

        else if (i === numNotebooks - 1) {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
        }
      });
    }
  });

  //console.log(returnArr);
});

// Automated test: true
router.post('/searchByDate', async (req, res) => {
  const {
    user_hash, notebook_hash, mindate, maxdate,
  } = req.body;

  let newMin = new Date(mindate).setMinutes(0);
  newMin.setSeconds(0);
  newMin.setHours(0);

  let newMax = new Date(maxdate).setMinutes(0);
  newMax.setSeconds(0);
  newMax.setHours(0);

  maxdate = newMax.getTime();
  mindate = newMin.getTime();


  if (!(user_hash)) {
    console.log('/searchText bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  const returnArr = [];


  firebaseUtil.getNotebooks(user_hash).then((responses) => {
    let numNotebooks = responses.notebook_list.length;
    //console.log(numNotebooks);

    if (notebook_hash !== undefined) {
      if (responses.notebook_list.includes(notebook_hash)) { numNotebooks = 1; } else {
        res.sendStatus(400);
        return;
      }
    }
    for (let i = 0; i < numNotebooks; i++) {
      let currNb = responses.notebook_list[i];
      if (notebook_hash !== undefined) currNb = notebook_hash;
      console.log(currNb);
      firebaseUtil.getNotebook('admin', currNb).then((notebook) => {
        // console.log(Object.keys(notebook.data_entries).length);

        const numEntries = Object.keys(notebook.data_entries).length;
        let currResult = {notebook: null, entries: []};
        if (notebook.date_created >= mindate && notebook.date_created <= maxdate) {
          currResult = {notebook: notebook.notebook_hash, entries: []};
        }

        for (let j = 0; j < numEntries; j++) {
          const dataentry = Object.values(notebook.data_entries)[j];
          if (dataentry.date_created >= mindate && dataentry.date_created <= maxdate) {
            if (currResult.notebook === null) currResult.notebook = notebook.notebook_hash
            currResult.entries.push(dataentry.entry_hash);
          }
          // console.log("Num entr: " + numEntries + " " + j);
          if (j === numEntries - 1) {
            // console.log("here");
            if (currResult.notebook != null) returnArr.push(currResult);
            if (i === numNotebooks - 1) {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(JSON.stringify({user_hash, results: returnArr}));
            }
          }
        }
      });
    }
  });

  //console.log(returnArr);
});

const makepdffunc = (req, res, notebook_hash) => {
  if (!res) {
    res = {
      setHeader() {},
      send() {},
    };
  }

  return firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    console.log('TEST:', Object.keys(notebook.data_entries));
    const pdfarray = Object.values(notebook.data_entries);
    // const pdfname = notebook.name;
    const pdfname = notebook_hash;
    let inline = false;
    if (notebook.format.image === 'inline') inline = true;
    pdfgen.genPDF(pdfarray, pdfname, 'server', inline);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({url: `${req.protocol}://${req.get('host')}/pdfdisp/${notebook_hash}.pdf`}));
  });
};

// Automated test: true
router.post('/sharePDF', async (req, res) => {
  const {notebook_hash} = req.body;

  if (!(notebook_hash)) {
    console.log('/sharePDF bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  makepdffunc(req, res, notebook_hash);
});

router.post('/makePDF', async (req, res) => {
  const {notebook_hash} = req.body;

  if (!(notebook_hash)) {
    console.log('/sharePDF bad', req.body);
    res.sendStatus(400);
    return;
  }

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  makepdffunc(req, res, notebook_hash);
});

// Automated test: true
(() => {
  const path = '/managerView';
  const props = ['user_hash'];
  const utilFunc = 'managerView';
  const thenHandler = () => {};
  const allowedErrors = ['Esclation to manager view failed. Do you have permission?'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/getBackup';
  const props = ['notebook_hash'];
  const utilFunc = 'makeLocalBackup';
  const thenHandler = () => {};
  const allowedErrors = ['Backup for this notebook does not exist'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: N/A
(() => {
  const path = '/backup';
  const props = ['notebook_hash'];
  const utilFunc = 'makeLocalBackup';
  const thenHandler = () => {};
  const allowedErrors = ['Backup for this notebook does not exist'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();


// Automated test: true
(() => {
  const path = '/feedback';
  const props = ['message'];
  const utilFunc = 'feedback';
  const thenHandler = () => {};
  const allowedErrors = ['Failed to send feedback'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/setNotebookPermissions';
  const props = ['user_hash', 'notebook_hash', 'changes'];
  const utilFunc = 'setNotebookPermissions';
  const thenHandler = () => {};
  const allowedErrors = ['Failed to change permissions'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/getLink';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getLink';
  const thenHandler = () => {};
  const allowedErrors = ['Failed to get Link. It\'s dangerous to go alone. Take this!\n:~{=======>'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/format';
  const props = ['user_hash', 'notebook_hash', 'settings'];
  const utilFunc = 'format';
  const thenHandler = () => {};
  const allowedErrors = ['Failed to format'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/formatAll';
  const props = ['user_hash', 'settings'];
  const utilFunc = 'formatAll';
  const thenHandler = () => {};
  const allowedErrors = ['User not found', 'Company not found'];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true, needs work
router.get('/notebook/:notebook_hash', async (req, res) => {
  const {notebook_hash} = req.params;

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  const allowedErrors = ['Notebook not found', 'Notebook not public'];

  // TODO get pdf instead of json
  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    if (!notebook.isPublic) {
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

    res.status(404).send('404 This link is invalid.');
  });
});

// Automated test: don't make test
router.get('/icon/:notebook_hash', async (req, res) => {
  const {notebook_hash} = req.params;
  // use mehul's pdf call to generade a pdf of the notebook
  // use pdf-image to convert the first page to a png of xxx resolution
  // use sharp to crop page to square of AxA dimension.
  // Return the path to the image or the image itself?

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }
  var notebookSize = -1;
  // Check size of notebook. If 0, return documents.png
  firebaseUtil.getNotebook('admin', notebook_hash).then((notebook) => {
    const pdfarray = Object.values(notebook.data_entries);
    notebookSize = pdfArray.length;
    console.log('Notebook size is '+notebookSize);
  });
  if(notebookSize == 0){
    console.log('Sending documents.png because the notebook is empty');
    res.sendFile('/images/document.png');
    return;
  }

  const allowedErrors = ['Notebook not found'];

  makepdffunc(req, false, notebook_hash).then(() => {
    const filename_pdf = `./genPDFs/${notebook_hash}`;

    const pdf_img = new PDFImage(filename_pdf + '.pdf');
    console.log(pdf_img);
    pdf_img.convertPage(0).then(function (filename_image) {
      // 0-th page (first page) of the slide.pdf is available as slide-0.png
      fs.existsSync(filename_image); // => true

      const filename_image2 = path.resolve(filename_image);

      console.log('Image is at ' + filename_image2);
      sharp(filename_image2).resize(300).toFile(filename_image2, function(err) {
          console.log('Image resized');
          console.log(filename_image2);
          res.sendFile(filename_image2);

          // fs.unlinkSync(filename_pdf);
          // fs.unlinkSync(filename_image);
        });
    });
  });

  // // TODO get image of first page of pdf
  // firebaseUtil.getNotebook('admin', notebook_hash).then(notebook =>
  //   // res.setHeader('Content-Type', 'application/json');
  //   // res.status(200).send(JSON.stringify(notebook, null, 4));
  //   if (!(notebook_hash)) {
  //     console.log('/getNotebooks bad', req.body);
  //     res.sendStatus(400);
  //     return;
  //   }
  //
  //   console.log(`TEST:${notebook.data_entries}`);
  //   const pdfarray = Object.values(notebook.data_entries);
  //   const path = 'tempIconGen' + Date.now();
  //   // const pdfPath = './genPDF/' + path;
  //   // const imagePath = path + '.png';
  //   // const imageEditPath = path + '_EDIT.png';
  //
  //   const inline = true;
  //   var image = undefined;
  //   pdfgen.genPDF(pdfarray, path, 'genPDF', inline); // Make sure it is actually being saved in .genPDF
  //
  //   // res.setHeader('Content-Type', 'image/png');
  //   // res.send(JSON.stringify({url: `${req.protocol}://${req.get('host')}/imageEditPath + '_EDIT'`}));
  //
  //   Promise.resolve()).catch((err) => {
  //   if (allowedErrors.includes(err.message)) {
  //     console.log(`${req.path} bad:\t\t\t`, err.message);
  //   } else {
  //     console.log(`${req.path} server failed:\t`, err.message);
  //   }
  //
  //   res.status(404).send('404 This link is invalid.');
  // });
});

// Automated test: don't make test
router.get('/icon/:notebook_hash/:entry_hash', async (req, res) => {
  const {notebook_hash, entry_hash} = req.params;

  if (firebaseUtil.isTest) {
    res.status(204).send();
    return;
  }

  const allowedErrors = ['Notebook not found'];

  // TODO get image of entry
  firebaseUtil.getNotebook('admin', notebook_hash).then(notebook =>
    // res.setHeader('Content-Type', 'application/json');
    // res.status(200).send(JSON.stringify(notebook, null, 4));

    Promise.resolve()).catch((err) => {
    if (allowedErrors.includes(err.message)) {
      console.log(`${req.path} bad:\t\t\t`, err.message);
    } else {
      console.log(`${req.path} server failed:\t`, err.message);
    }

    res.status(404).send('404 This link is invalid.');
  });
});

router.get('/downloadPDF/:notebook_hash', (req, res) => {
  const {notebook_hash} = req.params;

  makepdffunc(req, false, notebook_hash).then(() => {
    const file = `./genPDFs/${notebook_hash}.pdf`;
    res.download(file); // Set disposition and send it.
  });
});

// Automated test: true, needs work
router.use('/pdfdisp', (req, res, next) => {
  try {
    const notebook_hash = /pdfdisp\/(.+)/.exec(req.originalUrl)[1]
    makepdffunc(req, false, notebook_hash);
  } catch (e) {

  } finally {
    next();
  }
}, express.static(path.join(__dirname, '../genPDFs')));
// router.use('/pdfdisp', express.static(__dirname))
// router.use('/pdfdisp', express.static(path.resolve(__dirname, '../genPDFs')))
// (req, res) => {
//   const {pdfname} = req.params;
//   console.log(req.params);
//
//   if (firebaseUtil.isTest) {
//     res.status(204).send();
//     return;
//   }
//
//   const file = `./genPDFs/${pdfname}`;
//   res.download(file); // Set disposition and send it.
// });

// Automated test: true
(() => {
  const path = '/getCompanyUsers';
  const props = ['user_hash'];
  const utilFunc = 'getCompanyUsers';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/getCompanyUsersPermission';
  const props = ['user_hash', 'notebook_hash'];
  const utilFunc = 'getCompanyUsersPermission';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/restoreFromLocal';
  const props = ['notebook_hash'];
  const utilFunc = 'restoreFromLocal';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: true
(() => {
  const path = '/restoreFromRemote';
  const props = ['notebook_hash', 'backup'];
  const utilFunc = 'restoreFromRemote';
  const thenHandler = () => {};
  const allowedErrors = [];

  addRoute(path, props, utilFunc, thenHandler, allowedErrors);
})();

// Automated test: N/A
// (() => {
//   const path = '/deleteCompany';
//   const props = ['company_name'];
//   const utilFunc = 'deleteCompany';
//   const thenHandler = () => {};
//   const allowedErrors = [];
//
//   addRoute(path, props, utilFunc, thenHandler, allowedErrors);
// })();

module.exports = router;
