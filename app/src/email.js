const nodemailer = require('nodemailer');

module.exports = {
  sendEmail(emailAddTo) {
    const newUserName = 'John Doe';
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'VENoteApp@gmail.com', // TODO replace personal gmail account
        pass: 'VENote2017',
      },
    });

    const mailOptions = {
      from: '',
      to: emailAddTo,
      subject: 'New User Signed up to view Notebook...',
      text: `Hi, ${newUserName} has signed up.` +
      'If you did not approve this, please....',
    };


    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  },

};


module.exports.sendEmail('mehulap8@icloud.com');
