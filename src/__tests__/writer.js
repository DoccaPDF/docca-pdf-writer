import fs from 'fs';

import Writer from '../';

function readFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
}

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

        // place an image once, including the image id to automatically add it to the page resources
        .then(() => readFile('./test/fixtures/docca-logo-small-red.png'))
        .then(buffer => writer.addImage({ handle: 'myPngR', buffer }))
        .then(image => writer.placeImage({ id: image.id, handle: 'myPngR', x: 80, y: 750, width: 100, height: 35 }))

        // place an image twice after manually adding the image to the page resources
        .then(() => readFile('./test/fixtures/docca-logo-alpha.png'))
        .then(buffer => writer.addImage({ handle: 'myPngA', buffer }))
        .then(image => writer.addResources({ XObject: { myPngA: { id: image.id } } }))
        .then(() => writer.placeImage({ handle: 'myPngA', x: 50, y: 800, width: 275, height: 96.5 }))
        .then(() => writer.placeImage({ handle: 'myPngA', x: 400, y: 800, width: 91.6, height: 32.2 }))
        .then(() => writer.addText({ x: 380, y: 740, font: 'F1', size: 12, text: 'PNG with Alpha channel' }))
        .then(() => writer.addText({ x: 380, y: 720, font: 'F1', size: 12, text: 'placed over red docca image' }))

        // place an image twice, including the image id to automatically add it to the page resources
        // (it's ok to include the id in multiple placements)
        .then(() => readFile('./test/fixtures/docca-logo.png'))
        .then(buffer => writer.addImage({ handle: 'myPng', buffer }))
        .then(image =>
          writer.placeImage({ id: image.id, handle: 'myPng', x: 50, y: 680, width: 275, height: 96.5 })
          .then(() => writer.placeImage({ id: image.id, handle: 'myPng', x: 400, y: 680, width: 91.6, height: 32.2 }))
        )
        .then(() => writer.addText({ x: 380, y: 620, font: 'F1', size: 12, text: 'PNG no Alpha channel' }))

        // place an image twice, including the image id only the first time as we don't need to do it more than once
        .then(() => readFile('./test/fixtures/docca-logo.jpg'))
        .then(buffer => writer.addImage({ handle: 'myJpg', buffer }))
        .then(image => writer.placeImage({ id: image.id, handle: 'myJpg', x: 50, y: 560, width: 275, height: 96.5 }))
        .then(() => writer.placeImage({ handle: 'myJpg', x: 400, y: 560, width: 91.6, height: 32.2 }))
        .then(() => writer.addText({ x: 380, y: 500, font: 'F1', size: 12, text: 'JPEG' }))

        .then(() => writer.addText({ x: 10, y: 400, font: 'F1', size: 16, text: 'Link to Web' }))
        .then(() => writer.addLink({ x: 10, y: 400, x2: 100, y2: 420, target: 'https://docca.io' }))

        .then(() => writer.addText({ x: 10, y: 360, font: 'F1', size: 16, text: 'Link to Page 2' }))
        // internal document links must begin with a hash and have a matching page anchor
        .then(() => writer.addLink({ x: 10, y: 360, x2: 100, y2: 380, target: '#Page 2' }))

        .then(() => writer.addPageAnchor({ name: 'Page 1 mid', top: 400 }))
        .then(() => writer.addText({ x: 10, y: 340, font: 'F1', size: 16, text: 'Link to Middle of Page 1' }))
        .then(() => writer.addLink({ x: 10, y: 340, x2: 100, y2: 360, target: '#Page 1 mid' }))

        // add another page
        .then(() => writer.addPage({ MediaBox: [0, 0, 595, 841] }))
        .then(() => writer.addResources({ Font: { F1: font } }))
        // add a page anchor for this page
        .then(() => writer.addPageAnchor({ name: 'Page 2' }))
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
