import assert from 'assert';
import _omit from 'lodash/omit';
import _mapValues from 'lodash/mapValues';
import _merge from 'lodash/merge';

import { ref, asPdfDictionary } from '../utils';
import asPdfObject from '../pdf-object-serialize/as-pdf-object';

const resources = {
  Type: 'Resources',

  keys: [ 'ProcSet', 'Font' ],

  flattenKeys () {
    return {
      ProcSet: `[ /${this.ProcSet.join(' /')} ]`,
      Font: this.Font && asPdfDictionary(this.Font),
      XObject: this.XObject && asPdfDictionary(this.XObject)
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
   * add xobject resources
   * @param {Object}  xobjects keyed by handle
   */
  addXObjects (obj) {
    const refObj = _mapValues(obj, xobj => ref(xobj));
    this.XObject = _merge({}, this.XObject, refObj);
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
    if (resources.XObject) {
      this.addXObjects(resources.XObject);
    }
  },

  toPDF () {
    return asPdfObject(this);
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
  const initProps = _omit(props, 'Font', 'XObject');
  const resourcesI = Object.assign(Object.create(resources), {
    ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
    ...initProps
  });
  resourcesI.addResources(props);
  return resourcesI;
}
