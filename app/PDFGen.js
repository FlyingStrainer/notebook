PDFDocument = require ("pdfkit");
fs = require("fs");



// Create a document

module.exports = {
    genPDF : function (t1, t2, i1, i2, pdfName) {
        doc = new PDFDocument();
        
        // Pipe its output somewhere, like to a file or HTTP response
        // See below for browser usage
        doc.pipe(fs.createWriteStream(pdfName + '.pdf'));
        
        // Embed a font, set the font size, and render some text
        //doc.font('fonts/PalatinoBold.ttf')
        //   .fontSize(25)
        //   .text('Some text with an embedded font!', 100, 100)
        
        // Add another page
        doc.fontSize(12);
        doc.text(t1, 100, 200)
        doc.image(i1,100, 500, {width: 300});
        
        
        
        // Add some text with annotations
        doc.addPage()
        .text(t2, 100, 400)
        .image(i2,300, 500, {width: 300});
        
        // Finalize PDF file
        doc.end()
    }
}

//module.exports.genPDF("test", "test,", "testimage.jpg", "testimage.jpg", "pdfgenout");