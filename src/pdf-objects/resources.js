import assert from 'assert';
import _omit from 'lodash/omit';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';

import { ref, asPdfDictionary } from './utils';

const resources = {
  Type: 'Resources',

  keys: [ 'ProcSet', 'Font' ],

  flattenKeys () {
    return {
      ProcSet: `[ /${this.ProcSet.join(' /')} ]`,
      Font: this.Font && asPdfDictionary(this.Font)
    };
  },

  addFonts (obj) {
    const refObj = _mapValues(obj, fobj => ref(fobj));
    this.Font = _merge({}, this.Font, refObj);
  }
};

/**
 * Resources
 * @param {Object}  props
 * @param {Object}  props.Font
 * @example
 * Resources({
 *   Font: { F1: { id: 34 }}
 * })
 */
export default function Resources (props) {
  assert(props.id, `id is required`);
  const initProps = _omit(props, 'Font');
  const resourcesI = Object.assign(Object.create(resources), initProps);
  resourcesI.addFonts(props.Font);
  return resourcesI;
}
