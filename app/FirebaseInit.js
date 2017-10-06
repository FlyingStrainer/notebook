
//-----------FirebaseInit.js----------
//This file creates the initial Notebook database structure
//Can be used to add notebooks in the future
//Author: Mehul Patel
//Date Created: 10/1/2017
//------------------------------------
var admin = require("firebase-admin");

var serviceAccount = require("privkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vent-91586.firebaseio.com"
});

var database = admin.database();


//Notebook object currently consists of:
//	TITLE
//	UID
//	USERS ->this will be an array of user objects
//
//
//
console.log("{1}");

createNotebook("test", "1234", ["john", "Jane"]);
console.log("{6}");

function createUser(username, dateAdded, usrID) {
  var user = {username: username, initDate: dateAdded, userID: usrID};
  return user;
}


function createNotebook(title, users) {
	var notebook = {
		title: title,
		uid: "",
		users: users
	};
	console.log("{2}");
	var newKey = admin.database().ref().child('posts').push().key;
	console.log("{3}");
	var updates = {};
	console.log("{4}");
	notebook.uid = newKey;
	updates['/Notebooks/' + newKey] = notebook;
	console.log("{5}");
	//updates['/user-posts/' + uid + '/' + newKey] = notebook;

	return admin.database().ref().update(updates);

}

function convertToJsObj(json) {
	return JSON.parse(json);
}

function postNotebookObject(notebook, users) {
	var now = new Date();
	createNotebook(notebook.title, now.getTime(), users);
}
