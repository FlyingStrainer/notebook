
const app = require('./http-api');

console.log('trying to start server');

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const {port} = server.address();
  console.log(`Server started on port ${port}`);
});
