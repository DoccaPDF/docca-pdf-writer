import assert from 'assert';

import { textToString } from '../pdf-content/text';
import { toString as imageToString } from '../pdf-content/image';

import asPdfStream from '../pdf-object-serialize/as-pdf-stream';

const content = {
  Type: 'Content',

  keys: [ 'Length', 'Filter', 'Length1' ],

  flattenKeys () {
    return {
      Length: this.data.length
    };
  },

  /**
   * add text to the content
   * @param   {Object} text       defines location, font, and text
   * @param   {Number} text.x     place the text x points from the left
   * @param   {Number} text.y     place the text y points from the bottom
   * @param   {String} text.font  the font handle defined in the resources of the page
   * @param   {Number} text.size  the size of font to use
   * @param   {String} text.text  the text
   * this should be modified to accept an array of text objects
   */
  addText (text) {
    if (this.data) {
      this.data += textToString(text);
    } else {
      this.data = textToString(text);
    }
  },

  addImage ({ handle, width, height, x, y }) {
    const image = imageToString({ handle, width, height, x, y });
    if (this.data) {
      this.data += image;
    } else {
      this.data = image;
    }
  },

  toPDF () {
    return asPdfStream(this);
  }
};

/**
 * create a new content object
 * @param {Object} props
 * @param {Number} props.id
 */
export default function Content (props) {
  assert(props.id, `id is required`);
  return Object.assign(Object.create(content), props);
}
