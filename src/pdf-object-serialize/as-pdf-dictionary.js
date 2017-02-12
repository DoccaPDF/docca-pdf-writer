import { asPdfDictionaryLines } from '../utils';

/**
 * returns an object as a PDF Dictionary string
 * @param   {Object} obj
 * @returns {String}
 */
export default function asPdfDictionary (pdfObject) {
  const keys = Object.keys(pdfObject);
  const flatObj = pdfObject.flattenKeys();
  const lines = [
    `<<`,
    asPdfDictionaryLines(keys, flatObj) + `>>\n`
  ];
  return lines.join('\n');
}
