const email = require('./email');
const fs = require('fs');

it('email smoke test', () => {
  email.sendEmail('bsemail.@purdue.edu');
  expect(() => {
  }).not.toThrow();
});
