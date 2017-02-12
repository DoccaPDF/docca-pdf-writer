import assert from 'assert';

import { asPdfDictionaryLines, head } from '../utils';

export default function asPdfStream (pdfObject) {
  assert(pdfObject.keys, 'keys property is required');
  const keys = pdfObject.keys;
  const flatObject = pdfObject.flattenKeys();
  const lines = [
    head(pdfObject),
    `<<`,
    asPdfDictionaryLines(keys, flatObject) + `>>`,
    `stream`,
    pdfObject.data,
    `endstream`,
    `endobj\n`
  ];
  return lines.join('\n');
}
