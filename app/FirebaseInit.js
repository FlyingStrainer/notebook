//-----------FirebaseInit.js----------
//This file creates the initial Notebook database structure
//Can be used to add notebooks in the future

//Author: Mehul Patel
//Date Created: 10/1/2017
//------------------------------------
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vent-91586.firebaseio.com"
});

var database = admin.database();


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
console.log("{1}");


module.exports = {
	createUser: function (username, dateAdded, usrID) {
	  var user = {username: username, initDate: dateAdded, userID: usrID};
	  return user;
	},


	createNotebook: function (title, uid, users) {
		var notebook = {
			title: title,
			uid: uid,
			users: users
		};
		//need to generate new uid
		var newKey = firebase.database().ref().child('posts').push().key;
		var updates = {};
		updates['/posts/' + newPostKey] = postData;
		updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    
		return admin.database().ref().update(updates);
		//can we do returns instead of cb() in an async enviroments?
 }
 createNotebook: function(title, users) {
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
	},

	addNotebookEntry: function (user_hash, notebook_uuid, entry){
		//entry consists of "entry": { uuid, text, image, caption, date_created, author_id }
		//to add
	},

	convertToJsObj: function (json) {
		return JSON.parse(json);
	},

	postNotebookObject: function (notebook, users) {
		var now = new Date();
		createNotebook(notebook.title, now.getTime(), users);
	}

};
