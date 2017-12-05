// PDF Smoke Test
// Test basic implentation and of a smoke test

// TODO: Test to see if actual PDF is renedered and placed in current directory,
// maybe somehow look to see if text requested is present in document created??

const PDFGen = require('../PDFGen');
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkCAIA' +
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
            'A5IEDsgQeyAhO8AAAD//8XtFsSTFUE2AAAAAElFTkSuQmCC';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vent-91586.firebaseio.com',
});

PDFGen.init(admin);

it('tests', () => {
  // const testImagePath = '../test-util/testImage.jpg';
  const fname = 'pdfgenout.test';
  const entries = [{
    date_created: '11-5-2017',
    text: 'text1',
    image: testImage,
    author: 'Jane Doe',
  }, {
    date_created: '11-3-2017',
    text: 'text2',
    image: testImage,
    author: 'John Does',
  }];
  PDFGen.genPDF(entries, fname, 'server', true);
  expect(() => {
    fs.unlinkSync(`./genPDFs/${fname}.pdf`);
  }).not.toThrow();

  PDFGen.genPDF(entries, fname, 'server', false);
  expect(() => {
    fs.unlinkSync(`./genPDFs/${fname}.pdf`);
  }).not.toThrow();
});
