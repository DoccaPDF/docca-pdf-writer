import asPdfObject from '../as-pdf-object';

describe('object-serialise', () => {
  describe('asPdfObject', () => {
    it('converts object to string PDF object', () => {
      const pdfObject = {
        id: 3,
        keys: ['key1', 'key3'],
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
endobj
`;
      const actual = asPdfObject(pdfObject);
      expect(actual).toEqual(expected);
    });
  });
});
