import assert from 'assert';
import _forEach from 'lodash/forEach';
import _omit from 'lodash/omit';

import { arrayToString, ref } from '../utils';
import asPdfObject from '../pdf-object-serialize/as-pdf-object';

const pages = {
  Type: 'Pages',

  keys: ['Type', 'Kids', 'Count'],

  flattenKeys () {
    return {
      Type: '/Pages',
      Kids: arrayToString(this.Kids),
      Count: `${this.Kids.length}`
    };
  },

  addPage (kid) {
    if (!this.Kids) {
      this.Kids = [];
    }
    this.Kids.push(ref(kid));
  },

  toPDF () {
    return asPdfObject(this);
  }
};

/**
 * [Pages description]
 * @param {Object} props
 * @param {Number} props.id
 * @param {Array}  props.Kids
 */
export default function Pages (props) {
  assert(props.id, `id is required`);
  const initProps = _omit(props, 'Kids', 'Count');
  const pagesI = Object.assign(Object.create(pages), initProps);

  _forEach(props.Kids, (kid) => pagesI.addPage(kid));

  return pagesI;
}
