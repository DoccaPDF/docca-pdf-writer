
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
