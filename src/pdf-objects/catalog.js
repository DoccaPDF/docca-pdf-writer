import assert from 'assert';
import _omit from 'lodash/omit';

import { ref } from '../utils';
import asPdfObject from '../pdf-object-serialize/as-pdf-object';

const catalog = {
  Type: 'Catalog',

  keys: [ 'Type', 'Pages' ],

  flattenKeys () {
    return {
      Type: '/Catalog',
      Pages: this.Pages
    };
  },

  setPages (obj) {
    this.Pages = ref(obj);
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
