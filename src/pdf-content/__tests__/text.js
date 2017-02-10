import { textToString } from '../text';

describe('pdf-content', () => {
  describe('text', () => {
    it('returns a text string', () => {
      const actual = textToString({
        x: 10, y: 20, font: 'F1', size: 12, text: 'Hello World!'
      });
      const expected = `q
BT
10 20 Td
/F1 12 Tf
(Hello World!) Tj
ET
Q
`;
      expect(actual).toEqual(expected);
    });
  });
});
