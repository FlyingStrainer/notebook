var firebase = require("firebase");

//Set the configuration for your app
var config = {
  apiKey: 'AIzaSyBuBYxnmn16RZYxJs-X_xOBbbft2VIkBPg',
  authDomain: 'vent-91586.firebaseapp.com',
  databaseURL: 'https://vent-91586.firebaseio.com',
  storageBucket: 'ent-91586.appspot.com'

};

firebase.initializeApp(config);

// Get a reference to the storage service, which is used to create references in your storage bucket
var storageRef = firebase.storage();


//Source https://firebase.google.com/docs/storage/web/upload-files
// File or Blob named mountains.jpg
var file = testimage.jpg

// Create the file metadata
var metadata = {
  contentType: 'image/jpeg'
};

// Upload file and metadata to the object 'images/mountains.jpg'
var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    //...

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  var downloadURL = uploadTask.snapshot.downloadURL;
});
