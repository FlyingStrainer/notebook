
const app = require('./http-api');

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const {port} = server.address();
  console.log(`Server started on port ${port}`);
});
