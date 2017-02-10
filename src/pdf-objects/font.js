import assert from 'assert';

const font = {
  Type: 'Font',

  keys: [
    'Type', 'Subtype', 'Name', 'BaseFont', 'Encoding',
    'FontDescriptor', 'FirstChar', 'LastChar', 'Widths', 'ToUnicode'
  ],

  flattenKeys () {
    return {
      Type: '/Font',
      Subtype: `/${this.Subtype}`,
      BaseFont: `/${this.BaseFont}`,
      Encoding: `/${this.Encoding}`
    };
  }
};

/**
 * create a new content object
 * @param {Object} props
 * @param {Number} props.id
 */
export default function Font (props) {
  assert(props.id, `id is required`);
  return Object.assign(Object.create(font), props);
}
