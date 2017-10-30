const firebase = require('../FirebaseInit.js');

const testUserData = {
  user_hash: 'testUserHash',
  notebooks: [],
};

const testUserNotebook = {
  uid: 'notebookHash1',
  name: 'notebookName1',
  author: 'Test User',
  data_entries: [],
  tags: expect.any(Array),
};
testUserData.notebooks.push(testUserNotebook);

const testDataEntry = {
  uuid: 'testUuid',
  text: '',
  // image: '',
  // caption: '',
  date_created: '',
  author_id: '',
  tags: {
    tag_string: '',
  },
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

// TODO clean up new notebook
test.skip('#saveNotebook', (done) => {
  const notebookName = 'name';
  firebase.saveNotebook(testUserData.user_hash, notebookName).then(() => {
    done();
  });
});

// TODO clean up added entry
test.skip('#addEntry', (done) => {
  firebase.addEntry(testUserData.user_hash, testUserNotebook.uid, testDataEntry).then(() => {
    done();
  });
});
