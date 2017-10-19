const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port);

console.log(`todo list RESTful API server started on: ${port}`);

require('./FirebaseInit.js');
