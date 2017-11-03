
const admin = require('firebase-admin');
const FirebaseWiper = require('../test-util/FirebaseWiper');
const wiper = new FirebaseWiper(admin);

const request = require('supertest');
const api = require('../http-api');

beforeAll(async () => {
  await wiper.nukeFirebase();
});

afterAll(async () => {
  await wiper.nukeFirebase();
});

describe.skip('GET /user', () => {
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
describe.skip('POST /saveNotebook', () => {
  it('should save a notebook', async () => {
    const data = {
      name: 'notebook1',
      author: 'user1',
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
