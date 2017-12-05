// Test objective: Test the email capabilities of the email module
// Current Status: Smoke test

// Todo: Good for now, cannot extend easily while keeping it automated and without significant work
// Stetch: Implement some sort of loopback email to see if they are actually recieved

const email = require('../email');

console.error = jest.fn();

it('email smoke test', () => {
  email.sendEmail('@purdue.edu');
  expect(() => {
  }).not.toThrow();
});

it('try to throw an error', () => {
  email.sendEmail('invalidemail#iiunjn.c');
  expect(console.error).toHaveBeenCalledTimes(1);
});
