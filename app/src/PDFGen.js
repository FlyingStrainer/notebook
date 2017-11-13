const PDFDocument = require('pdfkit');
const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');
const Notebook = require('./objects/Notebook');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});


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
