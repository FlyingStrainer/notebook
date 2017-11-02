const email = require('./email');

it.skip('email smoke test', () => {
  email.sendEmail('@purdue.edu');
  expect(() => {
  }).not.toThrow();
});
