const email = require('./email');

it('email smoke test', () => {
  email.sendEmail('bsemail.@purdue.edu');
  expect(() => {
  }).not.toThrow();
});
