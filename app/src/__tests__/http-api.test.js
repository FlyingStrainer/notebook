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

describe('POST /register', () => {
  it('should return a user hash', async () => {
    const req = {
      email: 'testuser1@email.com',
      password: 'testpassword1',
      company_name: 'test',
    };

    await testApi('/register', req);
  });
});

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
      user_hash: '--user-key-1',
    };

    await testApi('/user', req);
  });
});

describe('POST /addNotebook', () => {
  it('should save a notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      name: 'JestersNotebook',
    };

    await testApi('/addNotebook', req);
  });
});

describe('POST /addEntry', () => {
  it('should add an entry to the saved notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
      entry: { type: 'text', text: 'epsilon'},
    };

    await testApi('/addEntry', req);
  });
});

describe('POST /getEntries', () => {
  it('get the entries for a notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/getEntries', req);
  });
});

describe.skip('POST /getNotebooks (depreciated)', () => { // depreciated
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

describe('POST /managerView', () => {
  it('Switch to manager view', async () => {
    const req = {
      user_hash: '--user-key-1',
    };

    await testApi('/managerView', req);
  });
});

describe('POST /getBackup', () => {
  it('Get a notebook backup', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/getBackup', req);
  });
});

describe('POST /feedback', () => {
  it('Send feedback to the devs', async () => {
    const req = {
      message: 'This is sample feedback',
    };

    await testApi('/feedback', req);
  });
});

describe('POST /setNotebookPermissions', () => {
  it('Set the permissions of the notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/setNotebookPermissions', req);
  });
});

describe('POST /format', () => {
  it('Set the format', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/format', req);
  });
});

describe('POST /getLink', () => {
  it('Get a link for sharing', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/getLink', req);
  });
});

describe('GET /notebook/:notebook_hash', () => {
  it('undetermined', async () => {
    const req = {
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/notebook/:notebook_hash', req);
  });
});
