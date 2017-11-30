
const Notebook = require('../Notebook');

it('should initialize with a new date', () => {
  const before = new Date();
  const notebook = new Notebook();
  const after = new Date();

  const {date_modified, date_created} = notebook;

  expect(date_modified >= before);
  expect(date_modified <= after);
  expect(date_created >= before);
  expect(date_created <= after);
});
