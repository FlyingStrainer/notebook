var admin = require("firebase-admin");

// Create a reference to the file we want to download
var imageRef = storageRef.child('images/testimage.jpg');

// Get the download URL
imageRef.getDownloadURL().then(function(url) {
  // Insert url into an <img> tag to "download"

}).catch(function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object_not_found':
      // File doesn't exist
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;
    
    //add more as needed

    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
      break;
  }
});
