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

describe('POST /cosignEntry', () => {
  it('cosign a notebook', async () => {
    const req = {
      user_hash: '--user-key-2',
      notebook_hash: '--notebook-key-2',
      entry_hash: '--entry-hash-1',
    };

    await testApi('/cosignEntry', req);
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

describe('POST /getEntry', () => {
  it('get a specific for a notebook', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
      entry_hash: '--entry-hash-1',
    };

    await testApi('/getEntry', req);
  });
});

describe('POST /searchByText', () => {
  it('search for text in all accessable notebooks', async () => {
    const req = {
      user_hash: '--user-key-1',
      text: 'epsilon',
    };

    await testApi('/searchByText', req);
  });
});

describe('POST /searchNotebooksByDate', () => {
  it('display all notebooks in a given date range', async () => {
    const req = {
      user_hash: '--user-key-1',
      mindate: '2017-12-01T02:02:26.994Z',
      maxdate: '2017-12-01T02:02:26.994Z',
    };

    await testApi('/searchNotebooksByDate', req);
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

describe('POST /makePDF', () => {
  it('create pdf of given notebook key', async () => {
    const req = {
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/makePDF', req);
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
      changes: {},
    };

    await testApi('/setNotebookPermissions', req);
  });
});

describe('POST /format', () => {
  it('Set the format', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
      settings: {},
    };

    await testApi('/format', req);
  });
});

describe('POST /formatAll', () => {
  it('Set the format of everything', async () => {
    const req = {
      user_hash: '--user-key-1',
      settings: {},
    };

    await testApi('/formatAll', req);
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
  it('Get a notebook without being a user', async () => {
    const path = '/notebook/-notebook-key-2';

    let response;

    try {
      response = await request(api)
        .get(path);
    } catch (e) {
      expect(e.message).toEqual('good');
    }

    expect(response.statusCode).toBeGreaterThanOrEqual(200);
    expect(response.statusCode).toBeLessThan(300);
  });
});

describe('GET /pdfdisp:pdfname', () => {
  it('Display given pdf', async () => {
    const path = '/pdfdisp/--pef-key-1';
    let response;

    try {
      response = await request(api)
        .get(path);
    } catch (e) {
      expect(e.message).toEqual('good');
    }

    expect(response.statusCode).toBeGreaterThanOrEqual(200);
    expect(response.statusCode).toBeLessThan(300);
  });
});

describe('POST /getCompanyUsers', () => {
  it('Get company that the user belongs to', async () => {
    const req = {
      user_hash: '--user-key-1',
    };

    await testApi('/getCompanyUsers', req);
  });
});

describe('POST /getCompanyUsersPermission', () => {
  it('Get the permissions for a user and notebook hash', async () => {
    const req = {
      user_hash: '--user-key-1',
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/getCompanyUsersPermission', req);
  });
});
describe('POST /restoreFromLocal', () => {
  it('Get the permissions for a user and notebook hash', async () => {
    const req = {
      notebook_hash: '--notebook-key-2',
    };

    await testApi('/restoreFromLocal', req);
  });
});
