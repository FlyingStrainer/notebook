const firebase = require('../FirebaseInit.js');

const testUserData = {
  user_hash: 'testUserHash',
  notebooks: [],
};

const testUserNotebook = {
  uid: 'notebookHash1',
  name: 'notebookName1',
  author: 'Test User',
  date_created: '2017-10-31T02:25:44.185Z',
  date_modified: '2017-10-31T02:26:00.879Z',
  data_entries: [],
  tags: expect.any(Array),
};
testUserData.notebooks.push(testUserNotebook);

const testDataEntry = {
  uuid: 'testUuid',
  text: 'Hello World!',
  date_created: '2017-10-31T02:24:52.848Z',
  date_modified: '2017-10-31T02:26:00.879Z',
  author_id: 'testUserHash',
  signatures: [],
  tags: {},
};
testUserNotebook.data_entries.push(testDataEntry);

test('#getNotebooks', (done) => {
  expect.assertions(2);

  firebase.getNotebooks(testUserData.user_hash).then((data) => {
    expect(data).toBeDefined();
    expect(data).toEqual(testUserData);
    done();
  });
});

test('#getNotebooks no permision', () => {
  expect.assertions(1);

  expect(async () => {
    await firebase.getNotebooks('Invalid');
  }).toThrow();
});

// TODO clean up new notebook
test.skip('#saveNotebook', (done) => {
  firebase.saveNotebook(testUserData.user_hash, 'name').then(() => {
    done();
  });
});

test.skip('#saveNotebook no permision', () => {
  expect.assertions(1);

  expect(async () => {
    await firebase.saveNotebook('Invalid', 'name');
  }).toThrow();
});

// TODO clean up added entry
test.skip('#addEntry', (done) => {
  const {user_hash, uid} = testUserData;
  firebase.addEntry(user_hash, uid, testDataEntry).then(() => {
    done();
  });
});

test.skip('#addEntry no permision', () => {
  expect.assertions(1);

  expect(async () => {
    await firebase.addEntry('Invalid', testUserNotebook.uid, testDataEntry);
  }).toThrow();
});
