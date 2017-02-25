import assert from 'assert';

import _includes from 'lodash/includes';

import asPdfDictionary from '../pdf-object-serialize/as-pdf-object';

const border = {
  Type: 'Border',

  keys: [ 'Type', 'W', 'S', 'D' ],

  flattenKeys () {
    return {
      Type: '/Border',
      W: this.W,
      S: this.S,
      D: this.D
    };
  },

  toPDF () {
    return asPdfDictionary(this);
  }

};

/**
 * create a new border object
 * @param {Object} props
 * @param {Number} props.W  width
 * @param {String} props.S  style
 * @param {Array}  props.D  dash
 */
export default function Border (props) {
  props.S && assert(_includes(['S', 'D', 'B', 'I', 'U'], props.S), `style must be one of 'S', 'D', 'B', 'I', 'U'`);
  return Object.assign(Object.create(border), props);
}
