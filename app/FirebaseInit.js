
//-----------FirebaseInit.js----------
//This file creates the initial Notebook database structure
//Can be used to add notebooks in the future
//Author: Mehul Patel
//Date Created: 10/1/2017
//------------------------------------
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

function createNotebook(title, uid) {
