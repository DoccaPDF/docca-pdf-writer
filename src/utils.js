
export function ref (obj) {
  return `${obj.id} 0 R`;
}

export function head (obj) {
  return `${obj.id} 0 obj`;
}

/**
 * returns a PDF object as an array of strings
 * @param   {Array}   keys   the PDF keys
 * @param   {Object}  props
 * @param   {}        props[key]  a PDF key
 * @returns {String}
 */
export function props2Array (keys, props) {
  return keys.map(key => {
    if (props[key]) {
      return `/${key} ${props[key]}`;
    }
  }).filter(val => val);
}

/**
 * returns a PDF object as a string
 * @param   {Object} obj
 * @param   {Array}  obj.keys  the PDF keys
 * @param   {Array}  obj[key]  a PDF key
 * @returns {String}
 */
export function asPdfDictionaryLines (keys, flatObject) {
  return props2Array(keys, flatObject).join('\n') + '\n';
}

/**
 * returns an object as a PDF Dictionary string
 * @param   {Object} obj
 * @returns {String}
 */
export function asPdfDictionary (pdfObject) {
  const keys = Object.keys(pdfObject);
  const lines = [
    `<<`,
    asPdfDictionaryLines(keys, pdfObject) + `>>\n`
  ];
  return lines.join('\n');
}

/**
 * join truthy values in an array into a PDF array
 * @param   {Array} values
 * @returns {String}
 */
export function arrayToString (values) {
  return values && values.length && `[${values.join(' ')}]`;
}

export function xref (offsets, trailerStr) {
  const lines = [
    'xref',
    `0 ${offsets.length + 1}`,
    '0000000000 65535 f '
  ];
  offsets.forEach(offset => {
    const formatted = `0000000000${offset}`.slice(-10);
    lines.push(`${formatted} 00000 n `);
  });
  lines.push(`trailer\n${trailerStr}`);
  return lines.join('\n');
}
