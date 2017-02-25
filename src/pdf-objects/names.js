
import { ref, arrayToString } from '../utils';
import asPdfDictionary from '../pdf-object-serialize/as-pdf-dictionary';

const names = {
  Type: 'Names',

  keys: [
    'Dests', 'AP', 'Javascript', 'Pages', 'Templates', 'IDS', 'URLS', 'EmbeddedFiles'
  ],

  flattenKeys () {
    return {
      Dests: this.Dests && `<< /Names ${arrayToString(this.Dests)} >>`
    };
  },

  /**
   * add a destination
   * @param {String}  dest.name  the name of the destination
   * @param {Object}  dest.page  the PDF Page object
   * @param {Number}  dest.left  the coordinate on the page to be placed at the left of the window
   * @param {Number}  dest.top   the coordinate on the page to be placed at the top of the window
   * @param {Number}  dest.zoom  the factor to magnify the contents of the page to
   */
  addDest ({ name, page, left = 0, top = 'null', zoom = 0 }) {
    if (!this.Dests) {
      this.Dests = [];
    }
    this.Dests.push(`(${name})`);
    // this.Dests.push(ref(obj));
    this.Dests.push(arrayToString([ref(page), '/XYZ', left, top, zoom]));
  },

  toPDF () {
    return asPdfDictionary(this);
  }

};

/**
 * create a new names object
 * @param {Object} props
 */
export default function Names (props) {
  return Object.assign(Object.create(names), props);
}
