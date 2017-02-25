import assert from 'assert';
import _omit from 'lodash/omit';

import { ref } from '../utils';
import asPdfObject from '../pdf-object-serialize/as-pdf-object';
import asPdfDictionary from '../pdf-object-serialize/as-pdf-dictionary';

const catalog = {
  Type: 'Catalog',

  keys: [ 'Type', 'Pages', 'Names' ],

  flattenKeys () {
    return {
      Type: '/Catalog',
      Pages: this.Pages,
      Names: this.Names && asPdfDictionary(this.Names)
    };
  },

  setPages (obj) {
    this.Pages = ref(obj);
  },

  /**
   * add a destination
   * @param {String}  dest.name  the name of the destination
   * @param {Object}  dest.page  the PDF Page object
   * @param {Number}  dest.left  the coordinate on the page to be placed at the left of the window
   * @param {Number}  dest.top   the coordinate on the page to be placed at the top of the window
   * @param {Number}  dest.zoom  the factor to magnify the contents of the page to
   */
  addNameDest (dest) {
    this.Names.addDest(dest);
  },

  toPDF () {
    return asPdfObject(this);
  }

};

/**
 * create a new content object
 * @param {Object} props
 * @param {Number} props.id
 */
export default function Catalog (props) {
  assert(props.id, `id is required`);
  const initProps = _omit(props, 'Pages');
  const catalogI = Object.assign(Object.create(catalog), initProps);
  catalogI.setPages(props.Pages);
  return catalogI;
}
