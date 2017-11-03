
const admin = require('firebase-admin');
const FirebaseWiper = require('../test-util/FirebaseWiper');
const wiper = new FirebaseWiper(admin);
const tdata = require('../test-util/firebase-test-data');

const request = require('supertest');
const api = require('../http-api');

beforeAll(async () => {
  await wiper.nukeFirebase();

  const updates = tdata;
  admin.database().ref().update(updates);
});

afterAll(async () => {
  // await wiper.nukeFirebase();
});

/*
describe('POST /user', () => {
  it('should return json', async () => {
    const data = {
      user_hash: '--user-key-1',
    };

    const response = await request(api)
      .post('/user')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const rdata = response.data;
    expect(rdata.key).toBeDefined();
  });
});
*/

describe('POST /user', () => {
  it('should return json', async () => {

    // json in
    const data = {
      user_hash: '--user-key-1',
    };

    const response = await request(api)
      .post('/user')
      .send(data);

    // keep expect response to be defined
    expect(response).toBeDefined();

    // expect status codes according to:
    // https://github.com/FlyingStrainer/notebook/blob/test-server/app/src/http-api.js
    expect(response.statusCode).toBe(200);

    const rdata = response.data;

    // match rdata to:
    // https://github.com/FlyingStrainer/notebook/blob/dev/docs/API_requests.txt
    // and the test server above
    expect(rdata.user_hash).toBeDefined();
    // "user_hash": "",
    expect(rdata.company_name).toBeDefined();
    // "company_name": "",
    expect(rdata.notebooks).toBeDefined();
    // "notebooks": [
    //   "notebook_hash",
    //   "notebook_hash",
    //   ...
    // ],
    expect(rdata.roles).toBeDefined();
    // "roles": [
    //   <role>,
    //   <role>
    // ]
  });
});

// Cleanup test notebook
describe('POST /saveNotebook', () => {
  it('should save a notebook', async () => {
    const data = {
      name: 'JestersNotebook',
      author: 'JestTester',
    };

    const response = await request(api)
      .post('/saveNotebook')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
  });
});

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
  });
});

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
  it('Get the notbooks that we added', async () => {
    const data = {
      name: 'JestersNotebook',
      author: 'JestTester',
    };

    const response = await request(api)
      .post('/getNotebooks')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body.notebook_hash).toBeDefined();
  });
});
