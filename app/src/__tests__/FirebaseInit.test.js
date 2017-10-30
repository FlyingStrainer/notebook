const firebase = require('../FirebaseInit.js');

const testUserData = {
  user_hash: 'testUserHash',
  notebooks: [
    {
      uid: 'notebookHash1',
      name: 'notebookName1',
      author: 'Test User',
      data_entries: [],
      tags: expect.any(Array),
    },
  ],
};

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
  firebase.saveNotebook(notebookName).then(() => {
    done();
  });
});

// TODO clean up added entry
test.skip('#addEntry', (done) => {
  firebase.addEntry(testDataEntry).then(() => {
    done();
  });
});
