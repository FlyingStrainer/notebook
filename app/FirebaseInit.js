//-----------FirebaseInit.js----------
//This file creates the initial Notebook database structure
//Can be used to add notebooks in the future
//Author: Mehul Patel
//Date Created: 10/1/2017
//------------------------------------

//Old firebase stuff, replacing with firebase admin sdk
//var firebase = require('firebase-admin')
//
//var config = {
//    apiKey: "",
//    authDomain: "",
//    databaseURL: "",
//    projectId: "",
//    storageBucket: "",
//    messagingSenderId: ""
//  };
//firebase.initializeApp(config);
//
//var database = firebase.database();
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vent-91586.firebaseio.com"
});

//Notebook object currently consists of:
//	TITLE
//	UID
//	USERS ->this will be an array of user objects
//
//
//


function createUser(username, dateAdded, usrID) {
  var user = {username: username, initDate: dateAdded}, userID: usrID;
  return user;
}


function createNotebook(title, uid, users) {
	var notebook = {
		title: title;
		uid: uid;
		users: users
	};

	var newKey = firebase.database().ref().child('posts').push().key;

	var updates = {};
	updates['/posts/' + newPostKey] = postData;
	updates['/user-posts/' + uid + '/' + newPostKey] = postData;

	return admin.database().ref().update(updates);

}

function addNotebookEntry(user_hash, notebook_uuid, entry{uuid, text, image, caption, date_created, author_id}/*Is this the proper way to add an array?*/){
	//to add
}

function getNotebooks(user_hash){
	//toadd
	cb(/*stuff to return*/);
}

function convertToJsObj(json) {
	return JSON.parse(json);
}

function postNotebookObject(notebook, users) {
	var now = new Date();
	createNotebook(notebook.title, now.getTime(), users);
}
