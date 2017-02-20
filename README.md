
# Docca PDF Writer

A re-write of the original Docca PDF writer designed with extensibility and memory use in mind.

- set PDF info
- add standard PDF fonts
- write text
- add JPEG and PNG images once
- place images in pages multiple times

See [Building a PDF writer](building-pdf-writer.md) for a quick PDF primer.

### Usage

```
import fs from 'fs';
import Writer from 'docca-pdf-writer';

Writer({
  streamOut: fs.createWriteStream(`./my.pdf`),
  Title: 'My Title',
  Author: 'Me',
  Subject: 'Demo PDF Creation',
  Keywords: 'demo pdf',
  Creator: 'Jason',
  Producer: 'Docca PDF Writer'
})
.then(writer =>
  // add a font to the PDF
  writer.addFont({
    BaseFont: 'Helvetica',
    Subtype: 'Type1',
    Encoding: 'WinAnsiEncoding'
  })
  .then(font => {

    // create the first page and include a font
    return writer.addPage({
      MediaBox: [0, 0, 595, 841],
      Resources: { Font: { F1: font } }
    })

    // add text with the font we defined previously
    .then(() => writer.addText({ x: 10, y: 820, font: 'F1', size: 16, text: 'Images added once, placed twice' }))

    // add an image to the PDF then place it on the current page
    .then(() => readFile('./test/fixtures/docca-logo.jpg'))
    .then(buffer => writer.addImage({ handle: 'myJpg', buffer }))
    .then(image => writer.placeImage({ id: image.id, handle: 'myJpg', x: 50, y: 560, width: 275, height: 96.5 }))
    .then(() => writer.placeImage({ handle: 'myJpg', x: 400, y: 560, width: 91.6, height: 32.2 }))
    .then(() => writer.addText({ x: 380, y: 500, font: 'F1', size: 12, text: 'JPEG' }))

    // add another page adding the font later
    .then(() => writer.addPage({ MediaBox: [0, 0, 595, 841] }))
    .then(() => writer.addResources({ Font: { F1: font } }))

    .then(() => writer.addText([
      { x: 10, y: 800, font: 'F1', size: 16, text: 'Hello Again!' },
      { x: 200, y: 800, font: 'F1', size: 12, text: 'Page 2' }
    ]))
    .then(() => writer.addText([
      { x: 10, y: 700, font: 'F1', size: 16, text: 'More Hello' },
    ]))
    .then(() => writer.finish());
  })
)
);
```
