
const app = require('./http-api');

// Define the port to run on
app.set('port', 3000);

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const {port} = server.address();
  console.log(`Server started on port ${port}`);
});
