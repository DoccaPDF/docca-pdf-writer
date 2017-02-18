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
<<<<<<< HEAD
      writer.addPage({ MediaBox: [0, 0, 595, 841] })
      .then(() => writer.addText({ x: 10, y: 800, font: 'F1', size: 16, text: 'Hello World!' }))
      .then(() => writer.addText({ x: 200, y: 800, font: 'F1', size: 12, text: 'Page 1' }))
      .then(() => writer.addPage({ MediaBox: [0, 0, 595, 841] }))
      .then(() => writer.addText([
        { x: 10, y: 800, font: 'F1', size: 16, text: 'Hello Again!' },
        { x: 200, y: 800, font: 'F1', size: 12, text: 'Page 2' }
      ]))
      .then(() => writer.addText([
        { x: 10, y: 700, font: 'F1', size: 16, text: 'More Hello' },
        { x: 200, y: 700, font: 'F1', size: 16, text: 'Page 2' }
      ]))
      .then(() => {
        return new Promise((resolve, reject) => {
          fs.readFile('./test/fixtures/docca-logo-alpha.png', (err, buffer) => {
            if (err) {
              return reject(err);
            }
            resolve(writer.addImage({ handle: 'myImg', buffer }));
          });
        });
      })
      .then(() => writer.placeImage({ handle: 'myImg', x: 50, y: 700, width: 100, height: 50 }))
      .then(() => writer.finish())
=======
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
        .then(() => writer.addText({ x: 10, y: 800, font: 'F1', size: 16, text: 'Hello World!' }))
        .then(() => writer.addText({ x: 200, y: 800, font: 'F1', size: 12, text: 'Page 1' }))
        .then(() => writer.addPage({
          MediaBox: [0, 0, 595, 841]
          // Resources: { Font: { F1: font } }
        }))
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
>>>>>>> master
    )
  );
});
