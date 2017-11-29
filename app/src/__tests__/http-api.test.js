// http API Test.
// Tests to see if all API Calls work from a http GET/POST level

// TODO: Make sure all API calls are included, verify that they all work

const request = require('supertest');
const api = require('../http-api');

jest.mock('../firebase-util');

async function testApi(path, req) {
  let response;

  try {
    response = await request(api)
      .post(path)
      .send(req);
  } catch (e) {
    expect(e.message).toEqual('good');
  }

  expect(response.statusCode).toBeGreaterThanOrEqual(200);
  expect(response.statusCode).toBeLessThan(300);
}

describe('POST /login', () => {
  it('should return a user hash', async () => {
    const req = {
      email: 'testuser1@email.com',
      password: 'testpassword1',
    };

    await testApi('/login', req);
  });
});

describe('POST /user', () => {
  it('should return json', async () => {
    // TODO
    const req = {
    };

    await testApi('/user', req);
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

    await testApi('/getNotebooks', req);
  });
});

describe('POST /getNotebook', () => {
  it('Get the details of a notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/getNotebook', req);
  });
});
