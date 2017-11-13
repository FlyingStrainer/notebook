const PDFDocument = require('pdfkit');
const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');
const Notebook = require('./objects/Notebook');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

var testImage =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkCAIA' +
            'AADxLsZiAAAFvklEQVR4nOzXwW2kQBgG0V2LKMiRGBAxkCPnDsEHh+AZGk+9l0B' +
            '/ElLpZxlj/AP4dF+zBwDcQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQ' +
            'MSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQ' +
            'eyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQO' +
            'SBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgAS' +
            'xAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOy' +
            'BB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSx' +
            'A5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyA' +
            'BLEDEsQOSBA7IEHsgASxAxLEDkhYbnvp2rfb3gL+kPU4b3jFZQckiB2QIHZAgtg' +
            'BCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkC' +
            'B2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliB' +
            'ySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC' +
            '2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2' +
            'QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZCwzB7As6zHOXvCK137NnsCT+GyAx' +
            'LEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7' +
            'IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5I' +
            'EDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLE' +
            'DEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IE' +
            'HsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLED' +
            'kgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAE' +
            'sQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDs' +
            'gQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEs' +
            'QOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsg' +
            'ASxAxLEDkgQOyBB7IAEsQMSxA5IWGYP4FmufZs9Ad5C7H5lPc7ZE17pI0vnG/HD' +
            'byyQIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtg' +
            'BCWIHJIgdkCB2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkC' +
            'B2QILYAQliBySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliB' +
            'ySIHZAgdkCC2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZAgdkCC' +
            '2AEJYgckiB2QIHZAgtgBCWIHJIgdkCB2QILYAQliBySIHZDwf4wxewPA27nsgAS' +
            'xAxLEDkgQOyBB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOy' +
            'BB7IAEsQMSxA5IEDsgQeyABLEDEsQOSBA7IEHsgASxAxLEDkgQOyBB7IAEsQMSx' +
            'A5IEDsgQeyAhO8AAAD//8XtFsSTFUE2AAAAAElFTkSuQmCC'

// Create a document

module.exports = {
  genPDF(entries, pdfName) {
    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream(`${pdfName}.pdf`));
    doc.fontSize(12);
    // Embed a font, set the font size, and render some text
    // doc.font('fonts/PalatinoBold.ttf')
    //   .fontSize(25)
    //   .text('Some text with an embedded font!', 100, 100)
    for (var i = 0; i<entries.length; i++) {
      doc.text(entries[i].date, 100, 200);
      doc.text(entries[i].text, 100, 220);
      doc.image(entries[i].imgpath, 100, 300, {fit:[200,200]});
      doc.text(entries[i].caption, 100, 502);
      doc.addPage();
    }

    // Finalize PDF file
    doc.end();
  },
  
  saveTestImage(base64Img) {
  	var base64Data = base64Img.replace(/^data:image\/png;base64,/, "");


	require("fs").writeFile("testimg.png", base64Data, 'base64', 
	function(err, data) {
	if (err) {
    	console.log('err', err);
	}
	console.log('success');

		});
  },
};
///date -> text -> image -> caption
var pdfnamein = "testfile";
var entries = [{date:"11-2-2017", text:"text1",
 imgpath: "testimage.jpg", caption:"cap cap cap"}, {date:"11-3-2017", text:"text2",
  imgpath: "testimage2.jpg", caption:"cap cap cap"}];
 module.exports.genPDF(entries, pdfnamein);

 // Create a root reference
 //var storageRef = admin.storage().bucket("t").ref();

 //var pdfref = storageRef.child(`${pdfnamein}.pdf`);
// var pdffolderref = storageRef.child(`pdfs/${pdfnamein}.pdf`);
