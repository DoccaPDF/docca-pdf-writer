import assert from 'assert';

import { ref } from '../utils';

const xobject = {
  Type: 'XObject',

  keys: [
    'Type', 'Subtype', 'Length', 'BitsPerComponent', 'ColorSpace',
    'Width', 'Height', 'Filter', 'DecodeParms', 'Mask', 'SMask'
  ],

  flattenKeys () {
    return {
      Type: '/XObject',
      Subtype: `/${this.Subtype}`,
      Length: this.data.length,
      BitsPerComponent: this.BitsPerComponent,
      ColorSpace: `/${this.ColorSpace}`,
      Width: this.Width,
      Height: this.Height,
      Filter: `/${this.Filter}`,
      DecodeParms: this.DecodeParms,
      Mask: this.Mask,
      SMask: this.SMask && ref(this.SMask)
    };
  }

};

/**
 * create a new xobject object
 * @param {Object} props
 * @param {Subtype} props.Subtype
 */
export default function XObject (props) {
  assert(props.id, `id is required`);
  return Object.assign(Object.create(xobject), props);
}