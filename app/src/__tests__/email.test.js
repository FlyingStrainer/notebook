// Test objective: Test the email capabilities of the email module
// Current Status: Smoke test

// Todo: Good for now, cannot extend easily while keeping it automated and without significant work
// Stetch: Implement some sort of loopback email to see if they are actually recieved

const email = require('../email');

it.skip('email smoke test', () => {
  email.sendEmail('@purdue.edu');
  expect(() => {
  }).not.toThrow();
});
