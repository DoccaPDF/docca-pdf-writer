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
    Writer({ streamOut: fs.createWriteStream(`./tmp/writes-to-stream-out.pdf`) })
    .then(writer =>
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
      .then(() => writer.finish())
    )
  );
});
