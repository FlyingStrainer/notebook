
const Notebook = require('../Notebook');

it('should initialize with a new date', () => {
  const before = new Date();
  const notebook = new Notebook();
  const after = new Date();

  const {dateModified, dateCreated} = notebook;

  expect(dateModified >= before);
  expect(dateModified <= after);
  expect(dateCreated >= before);
  expect(dateCreated <= after);
});
