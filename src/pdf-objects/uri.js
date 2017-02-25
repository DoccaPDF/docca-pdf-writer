
import asPdfDictionary from '../pdf-object-serialize/as-pdf-object';

const uri = {
  Type: 'URI',

  keys: [ 'Base' ],

  flattenKeys () {
    return {
      Type: '/URI',
      Base: `(${this.Base})`
    };
  },

  toPDF () {
    return asPdfDictionary(this);
  }

};

/**
 * create a new URI object
 * @param {Object} props
 * @param {Number} props.Base
 * the catalog may include a URI entry with this dict
 */
export default function URI (props) {
  return Object.assign(Object.create(uri), props);
}
