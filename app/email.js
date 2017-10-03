var firebase = require('firebase-admin')

var config = {
    apiKey: "AIzaSyBuBYxnmn16RZYxJs-X_xOBbbft2VIkBPg",
    authDomain: "vent-91586.firebaseapp.com",
    databaseURL: "https://vent-91586.firebaseio.com",
    projectId: "vent-91586",
    storageBucket: "vent-91586.appspot.com",
    messagingSenderId: "789865238756"
  };
firebase.initializeApp(config);

var database = firebase.database();

var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'supportvennote@gmail.com', //just used a personal gmail account for testing
    pass: 'pass'
  }
});

function getData(user) {
  var mailOptions = {
    from: 'support@vennote.com',
    to: 'company@company.net',
    subject: 'New User Signed up to view Notebook...',
    text: 'Hi,' + dataEl.username + ' has signed up. If you did not approve this, please....'
  };
  return mailOptions;
}

transport.sendMail(getDate(user), function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
