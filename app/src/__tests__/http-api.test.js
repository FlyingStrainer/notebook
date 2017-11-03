const request = require('supertest');
const api = require('../http-api');

// GET /user HTTP/1.1
// Authorization: Basic dXNlcm5hbWU6cGFzcw==
describe('POST /test', () => {
  it('should return true', async () => {
    const response = await request(api)
      .post('/test')
      .set('Content-Type', 'application/json')
      .auth('username', 'password')
      .send(data);
    
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    });
});

describe('POST /user', () => {
  it('should return json', async () => {
    const response = await request(api)
      .get('/user')
      .auth('username', 'password');

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.header['content-type']).toMatch(/json/);
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


