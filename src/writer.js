import uuid from 'uuid';

import _defaults from 'lodash/defaults';
import _isArray from 'lodash/isArray';
import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _pick from 'lodash/pick';

import Catalog from './pdf-objects/catalog';
import Content from './pdf-objects/content';
import Font from './pdf-objects/font';
import Info from './pdf-objects/info';
import Page from './pdf-objects/page';
import Pages from './pdf-objects/pages';
import Resources from './pdf-objects/resources';
import XObject from './pdf-objects/xobject';

import Trailer from './pdf-objects/trailer';

import Image from './image';

import { xref } from './utils';

import asPdfDictionary from './pdf-object-serialize/as-pdf-dictionary';

export const writer = {
  idCounter: 0,
  pages: undefined,
  currentPage: undefined,

  /**
   * create a new page
   * @param {Object} page
   * @param {Object} [page.Resources]
   * @param {Object} [page.MediaBox]
   */
  addPage (page) {
    const currentPage = this.page;
    const resources = page.Resources
      ? Resources({ ...page.Resources, id: ++this.idCounter })
      : Resources({ id: ++this.idCounter });

    this.page = Page({
      MediaBox: this.mediaBox,
      ...page,
      Resources: resources,
      Parent: this.pages,
      id: ++this.idCounter
    });
    this.pages.addPage(this.page);

    return this.addContent()
    .then(() => this.writePage(currentPage));
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
    return this.writeObject(font);
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
    return this.writeObject(currentContent);
  },

  /**
   * add resources to the current page resources object
   * @param {Object} resources
   * @param {Object} resources.Font           fonts keyed by handle
   * @param {Object} resources.Font.<handle>  object with id: fontId
   * @example
   * page.addResources({
   *   Font: {
   *     F1: { id: 42 }
   *   }
   * })
   */
  addResources (resources) {
    this.page.addResources(resources);
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
    if (!_isArray(text)) {
      return this.content.addText([text]);
    }
    return this.content.addText(text);
  },

  /**
   * add an image to the PDF
   * @param {String} options.handle  identifier used in calls to placeImage
   * @param {[type]} options.buffer  image file buffer
   */
  addImage ({ handle, buffer }) {
    return Image(buffer)
    .then(image => {
      if (image.SMask) {
        return this.writeObject(XObject({ ...image.SMask, id: ++this.idCounter }))
        .then(smaskObj => {
          image.SMask = smaskObj;
          return this.writeObject(XObject({ ...image, id: ++this.idCounter }));
        });
      }
      return this.writeObject(XObject({ ...image, id: ++this.idCounter }));
    });
  },

  /**
   * place an image on the current page
   * @param {Number} [id]            the font object id - image resource will be added to page if id is supplied
   * @param {String} handle          the name of an image previously added to the document
   * @param {Number} options.width   the width to display the image at
   * @param {Number} options.height  the height to display the image at
   * @param {Number} options.x       the horizontal position of the bottom left corner of the image
   * @param {Number} options.y       the vertical position of the bottom left corner of the image
   */
  placeImage ({ id, handle, width, height, x, y }) {
    if (id) {
      return this.addResources({ XObject: { [handle]: { id } } })
      .then(() => this.content.addImage({ handle, width, height, x, y }));
    }
    return this.content.addImage({ handle, width, height, x, y });
  },

  /**
   * write a page and it's resources to the PDF
   * @param {Object}  page  a page object
   * @returns {Promise}  resolves to the page object
   */
  writePage (page) {
    if (!page) {
      return Promise.resolve();
    }
    return this.writeObject(page.Resources)
    .then(() => this.writeObject(page));
  },

  /**
   * write a PDF object to the file
   * records the object's file offset in objectFileOffsets for the xref
   * @param   {Number}        id    PDF object ID
   * @param   {String|Buffer} data
   * @returns {Promise}
   */
  writeObject (obj) {
    if (!obj) {
      return Promise.resolve();
    }
    this.objectFileOffsets[obj.id] = this.fileOffset;
    return this.write(obj.toPDF()).then(() => obj);
  },

  /**
   * write data to the PDF file
   * @param   {String} data
   * @returns {Promise}  resolves when the write is complete
   */
  write (data) {
    const buffer = Buffer.isBuffer(data) ? data : new Buffer(`${data}\n`, 'binary');
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
    return this.write(new Buffer(`%PDF-${this.pdfVersion}\n%\xFF\xFF\xFF\xFF\n`), 'binary');
  },

  /**
   * finish writing the PDF file
   * writes the Catalog, Page, Content, xref, Trailer, and footer
   * @returns {Promise}  resolves when the write is complete
   */
  finish () {
    const catalog = Catalog({ Pages: this.pages, id: ++this.idCounter });
    const info = Info({ ..._pick(this, Info().keys), id: ++this.idCounter });

    return this.writeObject(this.pages)
    .then(() => this.writePage(this.page))
    .then(() => this.writeObject(this.content))
    .then(() => this.writeObject(catalog))
    .then(() => this.writeObject(info))
    .then(() => {
      const trailer = Trailer({
        ID: [this.id, this.id],
        Size: Object.keys(this.objectFileOffsets).length + 1,
        Root: catalog,
        Info: info
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

