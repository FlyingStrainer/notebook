const query = require('../querydb');

const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

query.init(admin);

//makes sure algolia connection is working, as we are searching for an empty string which
//should return all objects in algolia
it('should return non empty json', () => {
    expect.assertions(1);

    return query.searchForText("").then((data) => {
        expect(data).toBeDefined()
    });
});
