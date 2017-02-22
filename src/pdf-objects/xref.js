import asPdfDictionary from '../pdf-object-serialize/as-pdf-dictionary';

import _keys from 'lodash/keys';
import _map from 'lodash/map';

const xref = {
  toPDF () {
    // sort offsets by object ids
    const offsets = _map(
      _keys(this.offsets).sort((a, b) => +a - +b), id => this.offsets[id]
    );
    const lines = [
      'xref',
      `0 ${offsets.length + 1}`,
      '0000000000 65535 f '
    ];
    offsets.forEach(offset => {
      const formatted = `0000000000${offset}`.slice(-10);
      lines.push(`${formatted} 00000 n `);
    });
    lines.push(`trailer\n${asPdfDictionary(this.trailer)}`);
    lines.push(`startxref\n${this.startx}\n%%EOF`);
    return lines.join('\n');
  }
};

/**
 * XRef
 * @param {Object}  props
 * @param {Number}  props.startx
 * @param {Object}  props.offsets
 * @param {Trailer} props.trailer
 */
export default function XRef (props) {
  return Object.assign(Object.create(xref), props);
}
