import assert from 'assert';

import { textToString } from '../pdf-content/text';

const content = {
  Type: 'Content',

  keys: [ 'Length' ],

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
