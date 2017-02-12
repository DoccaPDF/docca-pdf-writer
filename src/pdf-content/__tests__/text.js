import { textToString } from '../text';

describe('pdf-content', () => {
  describe('text', () => {
    it('returns a text string', () => {
      const actual = textToString([
        { x: 10, y: 20, font: 'F1', size: 12, text: 'Hello World!' }
      ]);
      const expected = `q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
Q
`;
      expect(actual).toEqual(expected);
    });

    it('includes BT/ET for every line', () => {
      const actual = textToString([
        { x: 10, y: 20, font: 'F1', size: 12, text: 'Hello World!' },
        { x: 10, y: 20, font: 'F1', size: 12, text: 'Hello World!' }
      ]);
      const expected = `q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
BT
10 20 Td
(Hello World!) Tj
ET
Q
`;
      expect(actual).toEqual(expected);
    });
  });
});
