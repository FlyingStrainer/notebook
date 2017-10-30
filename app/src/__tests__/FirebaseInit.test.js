const firebase = require('../FirebaseInit.js');


test('#getNotebooks', (done) => {
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
  firebase.saveNotebook(pName).then(() => {
    done();
  });
});
