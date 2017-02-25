import uuid from 'uuid';

import _defaults from 'lodash/defaults';
import _isArray from 'lodash/isArray';
import _pick from 'lodash/pick';

import Annot from './pdf-objects/annot';
import Action from './pdf-objects/action';
import Catalog from './pdf-objects/catalog';
import Content from './pdf-objects/content';
import Font from './pdf-objects/font';
import Info from './pdf-objects/info';
import Names from './pdf-objects/names';
import Page from './pdf-objects/page';
import Pages from './pdf-objects/pages';
import Resources from './pdf-objects/resources';
import XObject from './pdf-objects/xobject';

import Trailer from './pdf-objects/trailer';
import XRef from './pdf-objects/xref';

import Image from './image';

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
   */
  addText (text) {
    if (!_isArray(text)) {
      return this.content.addText([text]);
    }
    return this.content.addText(text);
  },

  /**
   * add a page link anchor
   * @param {String}  anchor.name  the name of the link anchor
   * @param {Number}  anchor.left  the coordinate on the page to be placed at the left of the window
   * @param {Number}  anchor.top   the coordinate on the page to be placed at the top of the window
   * @param {Number}  anchor.zoom  the factor to magnify the contents of the page to
   */
  addPageAnchor ({ name, left, top, zoom }) {
    this.catalog.addNameDest({ name, page: this.page, left, top, zoom });
    return Promise.resolve();
  },

  /**
   * add a link to the current page
   * @param   {Object} link       defines location, font, and link
   * @param   {Number} link.x     place the link rectangle x points from the left
   * @param   {Number} link.y     place the link rectangle y points from the bottom
   * @param   {Number} link.x2    span the link rectangle to x points from the left
   * @param   {Number} link.y2    span the link rectangle to y points from the bottom
   */
  addLink ({ x, y, x2, y2, target }) {
    let annotProps = {
      Subtype: 'Link',
      Rect: [x, y, x2, y2]
    };
    if (/^#/.test(target)) {
      annotProps.A = Action({ S: 'GoTo', D: target.replace(/^#/, '') });
    } else {
      annotProps.A = Action({ S: 'URI', URI: target });
    }
    const annot = Annot({ ...annotProps, id: ++this.idCounter });
    this.page.addAnnotation(annot);
    return this.writeObject(annot);
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

  writeXref ({ catalog, info }) {
    const trailer = Trailer({
      ID: [this.id, this.id],
      Size: Object.keys(this.objectFileOffsets).length + 1,
      Root: catalog,
      Info: info
    });
    const xref = XRef({ startx: this.fileOffset, trailer, offsets: this.objectFileOffsets });
    return this.writeObject(xref);
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
    if (obj.id) {
      this.objectFileOffsets[obj.id] = this.fileOffset;
    }
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
    this.catalog = Catalog({ Pages: this.pages, Names: Names(), id: ++this.idCounter });

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
    const info = Info({ ..._pick(this, Info().keys), id: ++this.idCounter });

    return this.writeObject(this.pages)
    .then(() => this.writePage(this.page))
    .then(() => this.writeObject(this.content))
    .then(() => this.writeObject(this.catalog))
    .then(() => this.writeObject(info))
    .then(() => this.writeXref({ catalog: this.catalog, info }));
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

