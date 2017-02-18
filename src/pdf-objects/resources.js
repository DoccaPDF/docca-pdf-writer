import assert from 'assert';
import _omit from 'lodash/omit';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';

import { ref, asPdfDictionary } from '../utils';

const resources = {
  Type: 'Resources',

  keys: [ 'ProcSet', 'Font' ],

  flattenKeys () {
    return {
      ProcSet: `[ /${this.ProcSet.join(' /')} ]`,
      Font: this.Font && asPdfDictionary(this.Font)
    };
  },

  /**
   * add font resources
   * @param {Object}  fonts keyed by handle
   */
  addFonts (obj) {
    const refObj = _mapValues(obj, fobj => ref(fobj));
    this.Font = _merge({}, this.Font, refObj);
  },

  /**
   * add resources
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
    if (resources.Font) {
      this.addFonts(resources.Font);
    }
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
  const resourcesI = Object.assign(Object.create(resources), {
    ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
    ...initProps
  });
  resourcesI.addResources(props);
  return resourcesI;
}
