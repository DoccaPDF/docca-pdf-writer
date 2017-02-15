import assert from 'assert';
import zlib from 'zlib';

import { asPdfDictionaryLines, head } from '../utils';

function asDeflatedSTream (pdfObject) {
  const keys = pdfObject.keys;
  const flatObject = pdfObject.flattenKeys();
  let data = pdfObject.data;

  flatObject.Filter = '/FlateDecode';
  flatObject.Length1 = data.length;
  data = new Buffer(zlib.deflateSync(data), 'binary');
  flatObject.Length = data.length;

  return Buffer.concat([
    new Buffer([
      head(pdfObject),
      `<<`,
      asPdfDictionaryLines(keys, flatObject) + `>>`,
      `stream\n`
    ].join('\n')),
    data,
    new Buffer(`\nendstream\nendobj\n`)
  ]);
}

export default function asPdfStream (pdfObject, { deflate = true } = {}) {
  assert(pdfObject.keys, 'keys property is required');
  if (deflate) {
    return asDeflatedSTream(pdfObject);
  }
  const keys = pdfObject.keys;
  const flatObject = pdfObject.flattenKeys();
  let data = pdfObject.data;
  const lines = [
    head(pdfObject),
    `<<`,
    asPdfDictionaryLines(keys, flatObject) + `>>`,
    `stream`,
    data,
    `endstream`,
    `endobj\n`
  ];
  return lines.join('\n');
}
