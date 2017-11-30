const PDFDocument = require('pdfkit');
const fs = require('fs');

let admin;

const Notebook = require('./objects/Notebook');

// Create a document

module.exports = {
  init(myAdmin) {
    admin = myAdmin;
  },

  genPDF(entries, pdfName, location) {
    const doc = new PDFDocument();


    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream(`${pdfName}.pdf`));
    doc.fontSize(12);
    // Embed a font, set the font size, and render some text
    // doc.font('fonts/PalatinoBold.ttf')
    //   .fontSize(25)
    //   .text('Some text with an embedded font!', 100, 100)
    for (let i = 0; i < entries.length; i++) {
      //const buf = new Buffer(entries[i].imgpath.replace(/^data:image\/png;base64,/, ''), 'base64');
      doc.text(entries[i].date_created, 100, 200);
      doc.text(entries[i].author, 100, 220);
      //doc.image(buf, 100, 300, {fit: [200, 200]});
      doc.text(entries[i].text, 100, 502);
      doc.addPage();
    }

    // Finalize PDF file
    doc.end();

    if (location === 'server') {
      // copy file to server
    }

    if (location === 'firebase') {
      // copy file to firebase
    }
  },

  /*saveTestImage(base64Img) {
    const base64Data = base64Img.replace(/^data:image\/png;base64,/, '');


    fs.writeFile(
      'testimg.png', base64Data, 'base64',
      (err, data) => {
        if (err) {
          console.log('err', err);
        }
        console.log('success');
      },
    );
  },*/
};
// /date -> text -> image -> caption
// const pdfnamein = 'testfile';
  



 // var entries = [{date:"11-5-2017", text:"text1", imgpath: testImage, caption:"cap cap cap"}, {date:"11-3-2017", text:"text2",
 //  imgpath: testImage, caption:"cap cap cap"}];
 // module.exports.genPDF(entries, "genpdf", "server");
// module.exports.saveTestImage(testImage);

// Create a root reference
// var storageRef = admin.storage().bucket("t").ref();

// var pdfref = storageRef.child(`${pdfnamein}.pdf`);
// var pdffolderref = storageRef.child(`pdfs/${pdfnamein}.pdf`);
