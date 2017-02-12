import assert from 'assert';

import { asPdfDictionary, head } from '../utils';

/**
 * returns a PDF object as a string
 * @param   {Object} obj
 * @param   {Number} obj.id
 * @param   {Array}  obj.keys  the PDF keys
 * @param   {Array}  obj[key]  a PDF key
 * @returns {String}
 */
export default function asPdfObject (pdfObject) {
  assert(pdfObject.keys, 'keys property is required');
  const flatObject = pdfObject.flattenKeys();
  const lines = [
    head(pdfObject),
    asPdfDictionary(flatObject) + `endobj\n`
  ];
  return lines.join('\n');
}
