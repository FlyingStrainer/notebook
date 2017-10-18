var nodemailer = require('nodemailer');
var emailAddTo = "mehulap8@gmail.com";

module.exports = {
  sendEmail: function (emailAddTo) {
    var newUserName = "John Doe";
    var transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'VENoteApp@gmail.com', //just used a personal gmail account for testing
        pass: 'VENote2017'
      }
    });
    
      var mailOptions = {
        from: '',
        to: emailAddTo,
        subject: 'New User Signed up to view Notebook...',
        text: 'Hi, ' + newUserName + ' has signed up. If you did not approve this, please....'
      };
    
    
    transport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

}


module.exports.sendEmail("mehulap8@icloud.com");

