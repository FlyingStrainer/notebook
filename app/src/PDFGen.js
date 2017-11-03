const PDFDocument = require('pdfkit');
const fs = require('fs');


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
    for (var i = 0; i<entries.size(); i++) {
      doc.text(entries[i].date, 100, 200);
      doc.text(entries[i].date, 100, 220);
      doc.image(entries[i].image, 100, 300, {width: 300});
      doc.text(entries[i].date, 100, 800);
      doc.addPage();
    }

    // Finalize PDF file
    doc.end();
  },
};
///date -> text -> image -> caption
var entries = [{date:"11-2-2017", text:"text1",
 image: "testimage.jpg", caption:"cap cap cap"}, {date:"11-3-2017", text:"text2",
  image: "testimage2.jpg", caption:"cap cap cap"}];
 module.exports.genPDF(
  "test", "test,", "testimage.jpg", "testimage.jpg", "pdfgenout");
