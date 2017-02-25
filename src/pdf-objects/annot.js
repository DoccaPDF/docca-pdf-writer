
import { arrayToString } from '../utils';

import asPdfObject from '../pdf-object-serialize/as-pdf-object';

const annot = {
  Type: 'Annot',

  keys: [
    'Type', 'Subtype', 'Contents', 'Rect', 'Border', 'BS',
    'A', 'Dest', 'H', 'PA', 'F' // Link
  ],

  flattenKeys () {
    return {
      Type: '/Annot',
      // Dest: /^#/.test(this.uri) && `/${this.uri.replace(/^#/, '')}`,
      Dest: this.Dest,
      // A: !/^#/.test(this.uri) && Action({ S: 'URI', URI: this.uri }).toPDF(),
      A: this.A && this.A.toPDF(),
      Subtype: `/${this.Subtype}`,
      Rect: arrayToString(this.Rect),
      H: this.H && `/${this.H}`,
      F: this.F,
      C: this.C && arrayToString(this.C),
      BS: this.B && this.B.toPDF()
    };
  },

  toPDF () {
    return asPdfObject(this);
  }

};

/**
 * create a new annotation object
 * @param {Object} props
 * @param {Number} props.id
 * @param {String} props.Dest
 * @param {Action} props.A           the action to take
 * @param {String} props.Subtype
 * @param {Array}  props.Rect        2 sets of x,y for opposing corners
 * @param {String} props.H           Highlight - N None, I Invert, O Outline, P Push
 * @param {Number} props.F           Format
 * @param {Object} props.BS          Border Style
 */
export default function Annot (props) {
  return Object.assign(Object.create(annot), props);
}

// link = {
//   Subtype: '/Link',
//   H: '/P',
//   PA: { Type: '/Action', S: 'URI', URI: 'htt://7-bit-ascii/' }
// }

// An annotation dictionary shall contain the F key. The F key’s Print flag bit
// shall be set to 1 and its Hidden, Invisible and NoView flag bits shall be set
// to 0

// Invisible: 1
// Hidden: 2
// Print: 3
// NoView: 6

// $ node
// > flags = 0
// 0
// // set 3rd bit (2) to true (1)
// > flags |= 1 << 2
// 4
// > flags.toString(2)
// '100'
