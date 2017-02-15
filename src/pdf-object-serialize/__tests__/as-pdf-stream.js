import asPdfStream from '../as-pdf-stream';

describe('object-serialise', () => {
  describe('asPdfStream', () => {
    it('converts object to string PDF object', () => {
      const pdfObject = {
        id: 3,
        keys: ['key1', 'key3'],
        data: 'Hello!',
        flattenKeys () {
          return {
            key1: 'value1',
            key3: 'value3'
          };
        }
      };
      const expected = `3 0 obj
<<
/key1 value1
/key3 value3
>>
stream
Hello!
endstream
endobj
`;
      const actual = asPdfStream(pdfObject, { deflate: false });
      expect(actual).toEqual(expected);
    });

    it('converts object to buffer PDF object', () => {
      const pdfObject = {
        id: 3,
        keys: ['key1', 'key3'],
        data: 'Hello!',
        flattenKeys () {
          return {
            key1: 'value1',
            key3: 'value3'
          };
        }
      };
      const expected = new Buffer([51, 32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 47, 107, 101, 121, 49, 32, 118, 97, 108, 117, 101, 49, 10, 47, 107, 101, 121, 51, 32, 118, 97, 108, 117, 101, 51, 10, 62, 62, 10, 115, 116, 114, 101, 97, 109, 10, 120, 156, 243, 72, 205, 201, 201, 87, 4, 0, 7, 162, 2, 22, 10, 101, 110, 100, 115, 116, 114, 101, 97, 109, 10, 101, 110, 100, 111, 98, 106, 10]);
      const actual = asPdfStream(pdfObject);
      expect(actual).toEqual(expected);
    });
  });
});
