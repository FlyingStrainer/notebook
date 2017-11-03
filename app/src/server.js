
const app = require('./http-api');
const websocket = require('./websocket');

var requestedport = process.env.PORT || 3000;
app.set('port', requestedport);

console.log(`Server trying port ${requestedport}`);

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const {port} = server.address();
  console.log(`Server started on port ${port}`);
});
