
class FirebaseWiper {
  constructor(admin) {
    Object.assign(this, {
      admin,
    });
  }

  removeAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    return this.admin.auth().listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          this.admin.auth().deleteUser(userRecord.uid);
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          this.removeAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  }

  clearAllData() {
    return this.admin.database().ref().remove();
  }

  nukeFirebase() {
    const promises = [];
    promises.push(this.removeAllUsers());
    promises.push(this.clearAllData());
    return Promise.all(promises);
  }
}

module.exports = FirebaseWiper;
