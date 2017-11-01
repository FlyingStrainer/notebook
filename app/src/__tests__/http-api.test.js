const request = require('supertest');
const api = require('../http-api');

// GET /user HTTP/1.1
// Authorization: Basic dXNlcm5hbWU6cGFzcw==

describe('#getNotebook', () => {
  it('should return json', async () => {
    const response = request(api)
      .get('/user')
      .auth('username', 'password');

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.header['content-type']).toMatch(/json/);
  });
});
