
const request = require('supertest');
const firebaseUtil = require('../firebase-util');
const api = require('../http-api');

const {firebaseAdmin} = firebaseUtil;

const mg = {
  email: 'jestemail@email.com',
  password: 'pass',
  company_name: 'jestcompany',
  name: 'name',
};

beforeAll(async () => {
  await firebaseUtil.deleteCompany(mg.company_name);

  try {
    const path = '/register';
    const req = mg;
    const response = await request(api).post(path).send(req);
    mg.user_hash = response.user_hash;
  } catch (e) {
  }

  try {
    const path = '/user';
    const req = mg;
    const response = await request(api).post(path).send(req);
    mg.user = response;
  } catch (e) {
  }

  try {
    const path = '/addNotebook';
    const req = mg;
    const response = await request(api).post(path).send(req);
    mg.notebook = response;
  } catch (e) {
  }
});

describe('GET /notebook/:notebook_hash', () => {
  it('Get a fail not being a user', async () => {
    let response;
    try {
      const path = `/notebook/${mg.notebook.notebook_hash}`;
      const req = mg;
      response = await request(api).post(path).send(req);
    } catch (e) {
      expect(e.message).toEqual('good');
    }

    expect(response.statusCode).toBe(404);
  });
});
