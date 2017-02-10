import { props2Array, asPdfDictionaryLines, asPdfObject } from '../utils';

describe('Utils', () => {
  describe('props2Array', () => {
    it('converts object to array lines of key and value', () => {
      const keys = ['key1', 'key3'];
      const props = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      };
      const expected = [`/key1 value1`, `/key3 value3`];
      const actual = props2Array(keys, props);
      expect(actual).toEqual(expected);
    });
  });

  describe('asPdfDictionaryLines', () => {
    it('converts object to string of lines of key and value', () => {
      const keys = ['key1', 'key3'];
      const props = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      };
      const expected = `/key1 value1\n/key3 value3\n`;
      const actual = asPdfDictionaryLines(keys, props);
      expect(actual).toEqual(expected);
    });
  });

  describe('asPdfObject', () => {
    it('converts object to string PDF object', () => {
      const pdfObject = {
        id: 3,
        keys: ['key1', 'key3'],
        flattenKeys () {
          return {
            key1: 'value1',
            key2: 'value2',
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
