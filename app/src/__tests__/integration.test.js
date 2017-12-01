
const request = require('supertest');
const api = require('../http-api');

async function testApi(path, req, res) {
  let response;

  try {
    response = await request(api)
      .post(path)
      .send(req);
  } catch (e) {
    expect(e.message).toEqual('good');
  }

  if (res.statusCode) {
    expect(response.statusCode).toBe(res.statusCode);
  }
  else {
    expect(response.statusCode).toBeGreaterThanOrEqual(200);
    expect(response.statusCode).toBeLessThan(300);
  }

  if (res.body) {
    expect(response.body).toBe(res.body);
  }
}

describe('POST /notebook/:notebook_hash', () => {
  it('should return a user hash', async () => {
    // const req = {
    //   email: 'testuser1@email.com',
    //   password: 'testpassword1',
    //   company_name: 'test',
    // };
    //
    // await testApi('/register', req);
  });
});
