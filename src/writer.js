import uuid from 'uuid';

import _defaults from 'lodash/defaults';
import _keys from 'lodash/keys';
import _map from 'lodash/map';

import Catalog from './pdf-objects/catalog';
import Content from './pdf-objects/content';
import Font from './pdf-objects/font';
import Page from './pdf-objects/page';
import Pages from './pdf-objects/pages';
import Resources from './pdf-objects/resources';

import Trailer from './pdf-objects/trailer';

import { asPdfObject, asPdfStream, asPdfDictionary, xref } from './pdf-objects/utils';

const writer = {
  idCounter: 0,
  pages: undefined,
  currentPage: undefined,

  /**
   * create a new page to add content to
   * @param {Object} page
   * @param {Object} [page.Resources]
   * @param {Object} [page.MediaBox]
   */
  addPage (page) {
    const currentPage = this.page;
    this.page = Page({
      Resources: this.defaultResources,
      MediaBox: this.mediaBox,
      ...page,
      Parent: this.pages,
      id: ++this.idCounter
    });
    this.pages.addPage(this.page);

    return this.addContent()
    .then(() => {
      if (currentPage) {
        return this.writeObject(currentPage.id, asPdfObject(currentPage));
      }
    });
  },

  /**
   * add a font to the PDF file
   * @param {Object} props
   * @param {Object} props.BaseFont
   * @param {Object} props.Subtype
   * @param {Object} props.Encoding
   * @return {Promise} resolves to the font object
   */
  addFont (props) {
    const font = Font({ ...props, id: ++this.idCounter });
    return this.writeObject(font.id, asPdfObject(font))
    .then(() => font);
  },

  /**
   * add a resources object to the PDF file
   * @param {Object} props
   * @param {Object} props.ProcSet
   * @param {Object} props.Font
   * @return {Promise} resolves to the resources object
   */
  addResources (props) {
    const resources = Resources({ ...props, id: ++this.idCounter });
    return this.writeObject(resources.id, asPdfObject(resources))
    .then(() => resources);
  },

  /**
   * add a content object to the current page
   * @param {Object} content
   * @param {String} content.data  PDF operations
   */
  addContent (content) {
    const currentContent = this.content;
    this.content = Content({ ...content, id: ++this.idCounter });
    this.page.addContent(this.content);
    if (currentContent) {
      return this.writeObject(currentContent.id, asPdfStream(currentContent));
    }
    return Promise.resolve();
  },

  /**
   * add text to the current content
   * @param   {Object} text       defines location, font, and text
   * @param   {Number} text.x     place the text x points from the left
   * @param   {Number} text.y     place the text y points from the bottom
   * @param   {String} text.font  the font handle defined in the resources of the page
   * @param   {Number} text.size  the size of font to use
   * @param   {String} text.text  the text
   * this should be modified to accept an array of text objects
   */
  addText (text) {
    this.content.addText(text);
  },

  /**
   * write a PDF object to the file
   * records the object's file offset in objectFileOffsets for the xref
   * @param   {Number}        id    PDF object ID
   * @param   {String|Buffer} data
   * @returns {Promise}
   */
  writeObject (id, data) {
    this.objectFileOffsets[id] = this.fileOffset;
    return this.write(data);
  },

  /**
   * write data to the PDF file
   * @param   {String} data
   * @returns {Promise}  resolves when the write is complete
   */
  write (data) {
    const buffer = new Buffer(`${data}\n`, 'binary');
    this.fileOffset += buffer.length;
    return new Promise((resolve, reject) => {
      this.streamOut.write(buffer, () => {
        resolve();
      });
    });
  },

  /**
   * initialise the writer object
   * @returns {Promise}  resolves when the header has been writted to the file
   */
  initialise () {
    _defaults(this, {
      id: uuid.v4().replace(/-/g, ''),
      mediaBox: [0, 0, 595, 841],
      pdfVersion: 1.4
    });

    this.pages = Pages({ id: ++this.idCounter }); // just one of these for the whole file
    this.objectFileOffsets = {}; // keep track of where each object is written to the file
    this.fileOffset = 0; // keep track of where the next object will be written

    // write the file header
    return this.write(new Buffer(`%PDF-${this.pdfVersion}\n%\xFF\xFF\xFF\xFF\n`), 'binary')
    .then(() => {
      // write a default font object
      return this.addFont({
        BaseFont: 'Helvetica',
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding'
      });
    })
    .then(font => {
      // write a default resources object
      return this.addResources({
        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
        Font: { F1: font }
      });
    })
    .then(resources => {
      // keep the resources object for later
      this.defaultResources = resources;
    });
  },

  /**
   * finish writing the PDF file
   * writes the Catalog, Page, Content, xref, Trailer, and footer
   * @returns {Promise}  resolves when the write is complete
   */
  finish () {
    const catalog = Catalog({ Pages: this.pages, id: ++this.idCounter });
    return this.writeObject(this.pages.id, asPdfObject(this.pages))
    .then(() => this.writeObject(this.page.id, asPdfObject(this.page)))
    .then(() => this.writeObject(this.content.id, asPdfStream(this.content)))
    .then(() => this.writeObject(catalog.id, asPdfObject(catalog)))
    .then(() => {
      const trailer = Trailer({
        ID: [this.id, this.id],
        Size: Object.keys(this.objectFileOffsets).length + 1,
        Root: catalog
      });
      const startx = this.fileOffset;

      // sort offsets by object ids
      const offsets = _map(
        _keys(this.objectFileOffsets).sort((a, b) => +a - +b), id => this.objectFileOffsets[id]
      );

      return this.write(xref(offsets, asPdfDictionary(trailer)))
      .then(() => this.write(`startxref\n${startx}\n%%EOF`));
    });
  }
};

/**
 * create a new writer instance
 * @param {Array}        props.mediaBox
 * @param {WriteStream}  props.streamOut
 * @example
 * Writer({ streamOut: fs.createWriteStream(`hello-world.pdf`) })
 * .then(writer =>
 *   writer.addPage()
 *   .then(() => writer.addText({ x: 10, y: 800, font: 'F1', size: 16, text: 'Hello World!' }))
 *   .then(() => writer.finish())
 * )
 */
export default function Writer (props) {
  const writerI = Object.assign(Object.create(writer), props);
  return writerI.initialise().then(() => writerI);
}

