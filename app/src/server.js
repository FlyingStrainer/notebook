
const app = require('./http-api');

var requestedport = 3000;

if (process.argv.slice(2)){
  requestedport = process.argv.slice(2);
}

// Define the port to run on
app.set('port', requestedport[0]);

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const {port} = server.address();
  console.log(`Server started on port ${port}`);
});
