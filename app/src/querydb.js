const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY,
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

database.ref('/Notebooks').once('value', (contacts) => {
  // Build an array of all records to push to Algolia
  const records = [];
  contacts.forEach((contact) => {
    // get the key and data from the snapshot
    const childKey = contact.key;
    const childData = contact.val();
    // We set the Algolia objectID as the Firebase .key
    childData.objectID = childKey;
    // Add object for indexing
    records.push(childData);
  });

  // Add or update new objects
  index
    .saveObjects(records)
    .then(() => {
      console.log('Notebooks imported into Algolia');
    })
    .catch((error) => {
      console.error('Error when importing contact into Algolia', error);
      process.exit(1);
    });
});


/* // Search query
  const query = "test";

  // Perform an Algolia search:
  // https://www.algolia.com/doc/api-reference/api-methods/search/
  index
    .search({
      query
    })
    .then(responses => {
      // Response from Algolia:
      // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
      console.log(responses.hits);
    }); */
