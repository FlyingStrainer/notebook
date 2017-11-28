// http API Test.
// Tests to see if all API Calls work from a http GET/POST level

// TODO: Make sure all API calls are included, verify that they all work

const FirebaseWiper = require('../test-util/FirebaseWiper');
const request = require('supertest');
const api = require('../http-api');

const apiTest = async (path, req, res) => {
  const response = await request(api)
    .post(path)
    .send(req);

  expect(response).toBeDefined();

  return response;
};

describe('POST /login', () => {
  it('should return a user hash', async () => {
    const req = {
      email: 'testuser1@email.com',
      password: 'testpassword1',
    };
    const res = {
      user_hash: '--user-key-1',
    };

    await apiTest('/login', req, res);
  });
});

describe('POST /user', () => {
  it('should return json', async () => {
    const req = {
      email: 'testuser1@email.com',
      password: 'testpassword1',
    };
    const res = tdata.UserList['--user-key-1'];
    res.notebooks = Object.keys(res.notebooks);

    await apiTest('/user', req, res);
  });
});

// Cleanup test notebook
/*
describe('POST /addNotebook', () => {
  it('should save a notebook', async () => {
    const data = {
      user_hash: 'JestTester',
      name: 'JestersNotebook',
    };

    const response = await request(api)
      .post('/addNotebook')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    // TODO check if number of notebooks went up
  });
});
*/

/*
describe('POST /addEntry', () => {
  it('should add an entry to the saved notebook', async () => {
    const data = {
      name: 'JestersNotebook',
      author: 'JestTester',
    };

    const response = await request(api)
      .post('/addEntry')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    // check if number of entries went up
  });
});
*/

/*
describe('POST /getEntries', () => {
  it('get the entry we just added', async () => {
    const data = {
      name: 'JestersNotebook',
      author: 'JestTester',
    };

    const response = await request(api)
      .post('/getEntries')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
  });
});
*/

describe('POST /getNotebooks', () => {
  it('Get the notbooks the user can access', async () => {
    const req = {
      user_hash: '--user-key-1',
    };
    const res = {
      notebooks: tdata.UserList['--user-key-1'].notebooks,
    };
    res.notebooks = Object.keys(res.notebooks);

    await apiTest('/getNotebooks', req, res);
  });
});

describe('POST /getNotebook', () => {
  it('Get the details of a notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };
    const res = notebooks: tdata.NotebookList['--notebook-key-1'];
    res.manager_list = Object.keys(res.manager_list);
    res.tag_list = Object.keys(res.tag_list);
    delete res.data_entries;

    await apiTest('/getNotebook', req, res);
  });
});
