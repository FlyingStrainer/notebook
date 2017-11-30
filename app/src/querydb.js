var dotenv = require('dotenv');
var algoliasearch = require('algoliasearch');
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
    var database = firebaseAdmin.database();


    var notebooksRef = database.ref("/Notebooks");
    //clear before import
    index.clearIndex(function(err, content) {
      console.log("Cleared");
    });

    notebooksRef.once('value', module.exports.initialImport);
  },

  initialImport(dataSnapshot) {

    // Array of data to index
    var objectsToIndex = [];
    // Get all objects
    var values = dataSnapshot.val();
    // Process each child Firebase object
    dataSnapshot.forEach((function(childSnapshot) {
      // get the key and data from the snapshot
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      // Specify Algolia's objectID using the Firebase object key
      childData.objectID = childKey;
      // Add object for indexing
      objectsToIndex.push(childData);
    }))
    // Add or update new objects
    index.saveObjects(objectsToIndex, function(err, content) {
      if (err) {
        throw err;
      }
      console.log('Firebase<>Algolia import done');
      //process.exit(0);
    });
  },


  searchForText(text) {
    // Search query

      // Perform an Algolia search:
      // https://www.algolia.com/doc/api-reference/api-methods/search/
    return index.search({
          query: text
        }).then(responses => {
          // Response from Algolia:
          // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
          console.log(responses.hits);
          return responses.hits;
        });
  },

}
