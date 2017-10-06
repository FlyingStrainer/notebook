PDFDocument = require ("pdfkit");
fs = require("fs");

// Create a document
doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream('output.pdf'));

// Embed a font, set the font size, and render some text
//doc.font('fonts/PalatinoBold.ttf')
//   .fontSize(25)
//   .text('Some text with an embedded font!', 100, 100)

// Add another page
doc.fontSize(12)
   .text('Text Text Text', 100, 500);

doc.image('testimage.jpg',100, 100, {width: 300});



// Add some text with annotations
doc.addPage()
   .fillColor("blue")
   .text('Here is a link!', 100, 100)
   //.underline(100, 100, 160, 27, color: "//0000FF")
   .link(100, 100, 160, 27, 'http://google.com/')

// Finalize PDF file
doc.end()
