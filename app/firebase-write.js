// Dependencies
const admin = require('firebase-admin');
const express = require('express');

// Setup
const db = admin.database();
const router = express.Router();

// Middleware
router.use(bodyParser.json());

// API
router.post('/words', (req, res) => {
  const {userId, word} = req.body;
  db.ref(`words/${userId}`).push({word}, error => {
    if (error) {
      res.sendStatus(500);
      // Log error to external service, e.g. Sentry
    } else {
      res.sendStatus(201);
    }
  };
});
