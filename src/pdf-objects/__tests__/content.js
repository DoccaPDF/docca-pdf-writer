import Content from '../content';

describe('pdf-objects', () => {
  describe('content', () => {
    it('creates a new object', () => {
      const content = Content({ id: 1 });
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        Type: 'Content'
      }));
    });

    it('adds text content', () => {
      const content = Content({ id: 1 });
      content.addText({
        x: 10, y: 20, font: "F1", size: 12, text: "Hello World!"
      });
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
BT
10 20 Td
/F1 12 Tf
(Hello World!) Tj
ET
Q
`
      }));
    });

    it('adds moar text content', () => {
      const content = Content({ id: 1 });
      content.addText({
        x: 10, y: 40, font: "F1", size: 12, text: "Hello World!"
      });
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
BT
10 40 Td
/F1 12 Tf
(Hello World!) Tj
ET
Q
`
      }));

      content.addText({
        x: 10, y: 20, font: "F1", size: 12, text: "Hello World!"
      });
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
BT
10 40 Td
/F1 12 Tf
(Hello World!) Tj
ET
Q
q
BT
10 20 Td
/F1 12 Tf
(Hello World!) Tj
ET
Q
`
      }));
    });

    it('flattens keys values', () => {
      const content = Content({ id: 1, data: 'Hello' });
      expect(content.flattenKeys()).toEqual({ Length: 5 });
    });
  });
});
