import fs from 'fs';

import Writer from '../';

describe('writer', () => {
  it('creates a writer instance', () =>
    Writer({ streamOut: fs.createWriteStream(`./tmp/creates-writer.pdf`) })
    .then(writer => expect(writer).toEqual(expect.objectContaining({
      id: expect.any(String),
      mediaBox: [0, 0, 595, 841]
    })))
  );

  it('accepts props', () =>
    Writer({
      size: [50, 50],
      producer: 'me',
      streamOut: fs.createWriteStream(`./tmp/accepts-props.pdf`)
    })
    .then(writer =>
      expect(writer).toEqual(expect.objectContaining({
        id: expect.any(String),
        mediaBox: [0, 0, 595, 841],
        streamOut: expect.any(fs.WriteStream)
      }))
    )
  );

  it('writes to streamOut', () =>
    Writer({
      streamOut: fs.createWriteStream(`./tmp/writes-to-stream-out.pdf`),
      Title: 'My Title',
      Author: 'Me',
      Subject: 'Info Test',
      Keywords: 'test info',
      Creator: 'Jason',
      Producer: 'docca pdf writer',
      CreationDate: new Date('2017-02-13T23:27:00'),
      ModDate: new Date('2017-02-13T23:28:00'),
      Trapped: true
    })
    .then(writer =>
      writer.addFont({
        BaseFont: 'Helvetica',
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding'
      })
      .then(font => {
        return writer.addPage({
          MediaBox: [0, 0, 595, 841],
          Resources: { Font: { F1: font } }
        })

        .then(() => writer.addText({ x: 10, y: 820, font: 'F1', size: 16, text: 'Images added once, placed twice' }))

        .then(() => {
          return new Promise((resolve, reject) => {
            fs.readFile('./test/fixtures/docca-logo-small-red.png', (err, buffer) => {
              if (err) {
                return reject(err);
              }
              resolve(writer.addImage({ handle: 'myPngR', buffer }));
            });
          });
        })
        .then(image => writer.addResources({ XObject: { myPngR: { id: image.id } } }))
        .then(() => writer.placeImage({ handle: 'myPngR', x: 80, y: 750, width: 100, height: 35 }))

        .then(() => {
          return new Promise((resolve, reject) => {
            fs.readFile('./test/fixtures/docca-logo-alpha.png', (err, buffer) => {
              if (err) {
                return reject(err);
              }
              resolve(writer.addImage({ handle: 'myPngA', buffer }));
            });
          });
        })
        .then(image => writer.addResources({ XObject: { myPngA: { id: image.id } } }))
        .then(() => writer.placeImage({ handle: 'myPngA', x: 50, y: 800, width: 275, height: 96.5 }))
        .then(() => writer.placeImage({ handle: 'myPngA', x: 400, y: 800, width: 91.6, height: 32.2 }))
        .then(() => writer.addText({ x: 380, y: 740, font: 'F1', size: 12, text: 'PNG with Alpha channel' }))
        .then(() => writer.addText({ x: 380, y: 720, font: 'F1', size: 12, text: 'placed over red docca image' }))

        .then(() => {
          return new Promise((resolve, reject) => {
            fs.readFile('./test/fixtures/docca-logo.png', (err, buffer) => {
              if (err) {
                return reject(err);
              }
              resolve(writer.addImage({ handle: 'myPng', buffer }));
            });
          });
        })
        .then(image => writer.addResources({ XObject: { myPng: { id: image.id } } }))
        .then(() => writer.placeImage({ handle: 'myPng', x: 50, y: 680, width: 275, height: 96.5 }))
        .then(() => writer.placeImage({ handle: 'myPng', x: 400, y: 680, width: 91.6, height: 32.2 }))
        .then(() => writer.addText({ x: 380, y: 620, font: 'F1', size: 12, text: 'PNG no Alpha channel' }))

        .then(() => {
          return new Promise((resolve, reject) => {
            fs.readFile('./test/fixtures/docca-logo.jpg', (err, buffer) => {
              if (err) {
                return reject(err);
              }
              resolve(writer.addImage({ handle: 'myJpg', buffer }));
            });
          });
        })
        .then(image => writer.addResources({ XObject: { myJpg: { id: image.id } } }))
        .then(() => writer.placeImage({ handle: 'myJpg', x: 50, y: 560, width: 275, height: 96.5 }))
        .then(() => writer.placeImage({ handle: 'myJpg', x: 400, y: 560, width: 91.6, height: 32.2 }))
        .then(() => writer.addText({ x: 380, y: 500, font: 'F1', size: 12, text: 'JPEG' }))

        .then(() => writer.addPage({ MediaBox: [0, 0, 595, 841] }))
        .then(() => writer.addResources({ Font: { F1: font } }))
        .then(() => writer.addText([
          { x: 10, y: 800, font: 'F1', size: 16, text: 'Hello Again!' },
          { x: 200, y: 800, font: 'F1', size: 12, text: 'Page 2' }
        ]))
        .then(() => writer.addText([
          { x: 10, y: 700, font: 'F1', size: 16, text: 'More Hello' },
          { x: 200, y: 700, font: 'F1', size: 16, text: 'Page 2' }
        ]))
        .then(() => writer.finish());
      })
    )
  );
});
