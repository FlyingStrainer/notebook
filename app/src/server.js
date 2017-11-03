
const app = require('./http-api');
const websocket = require('./websocket');

const requestedport = process.env.PORT || 3000;

console.log(`Server trying port ${requestedport}`);

// Listen for requests
const server = app.listen(requestedport);
websocket.attach(app, server);
