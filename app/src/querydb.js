const dotenv = require('dotenv');
const algoliasearch = require('algoliasearch');

dotenv.load();
const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

// load values from the .env file in this directory into process.env

let firebaseAdmin = null;

module.exports = {
  algolia,
  indexEx: index,

  init(myadmin) {
    firebaseAdmin = myadmin;
    module.exports.resetAlgolia();
  },

  resetAlgolia() {
    const database = firebaseAdmin.database();


    const notebooksRef = database.ref('/NotebookList');
    // clear before import
    index.clearIndex((err, content) => {
      console.log('Cleared');
    });

    notebooksRef.once('value', module.exports.initialImport);
  },

  initialImport(dataSnapshot) {
    // Array of data to index
    const objectsToIndex = [];
    // Get all objects
    const values = dataSnapshot.val();
    // Process each child Firebase object
    dataSnapshot.forEach(((childSnapshot) => {
      // get the key and data from the snapshot
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      // Specify Algolia's objectID using the Firebase object key
      childData.objectID = childKey;
      // Add object for indexing
      objectsToIndex.push(childData);
    }));
    // Add or update new objects
    index.saveObjects(objectsToIndex, (err, content) => {
      if (err) {
        throw err;
      }
      console.log('Firebase<>Algolia import done');
      // process.exit(0);
    });
  },


  searchForText(text) {
    // Search query

    // Perform an Algolia search:
    // https://www.algolia.com/doc/api-reference/api-methods/search/
    return index.search({
      query: text,
    }).then((responses) => {
      // Response from Algolia:
      // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
      console.log(responses.hits);
      return responses.hits;
    });
  },

};
