
const PDFGen = require('../PDFGen');
const fs = require('fs');

it('tests', () => {
  const fname = 'pdfgenout.test';
  PDFGen.genPDF('test', 'test,', 'testimage.jpg', 'testimage.jpg', fname);
  expect(() => {
    fs.unlinkSync(`${fname}.pdf`);
  }).not.toThrow();
});
