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
      content.addText([{
        x: 10, y: 20, font: "F1", size: 12, text: "Hello World!"
      }]);
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
Q
`
      }));
    });

    it('adds multi same style text content', () => {
      const content = Content({ id: 1 });
      content.addText([
        { x: 10, y: 20, font: "F1", size: 12, text: "Hello World!" },
        { x: 10, y: 50, font: "F1", size: 12, text: "Hello Again!" }
      ]);
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
BT
10 50 Td
(Hello Again!) Tj
ET
Q
`
      }));
    });

    it('adds multi different style text content', () => {
      const content = Content({ id: 1 });
      content.addText([
        { x: 10, y: 20, font: "F1", size: 12, text: "Hello World!" },
        { x: 10, y: 50, font: "F1", size: 16, text: "Hello Again!" }
      ]);
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
/F1 16 Tf
BT
10 50 Td
(Hello Again!) Tj
ET
Q
`
      }));
    });

    it('adds moar text content', () => {
      const content = Content({ id: 1 });
      content.addText([{
        x: 10, y: 40, font: "F1", size: 12, text: "Hello World!"
      }]);
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
/F1 12 Tf
BT
10 40 Td
(Hello World!) Tj
ET
Q
`
      }));

      content.addText([{
        x: 10, y: 20, font: "F1", size: 12, text: "Hello World!"
      }]);
      expect(content).toEqual(expect.objectContaining({
        id: 1,
        data: `q
/F1 12 Tf
BT
10 40 Td
(Hello World!) Tj
ET
Q
q
/F1 12 Tf
BT
10 20 Td
(Hello World!) Tj
ET
Q
`
      }));
    });

    it('flattens keys values', () => {
      const content = Content({ id: 1 });
      content.addText([{
        x: 10, y: 40, font: "F1", size: 12, text: "Hello World!"
      }]);
      expect(content.flattenKeys()).toMatchSnapshot();
    });

    it('adds an image', () => {
      const content = Content({ id: 1 });
      content.addImage({ handle: 'I1', width: 20, height: 30, x: 40, y: 50 });
      expect(content).toMatchSnapshot();
    });

    it('adds an image to existing text', () => {
      const content = Content({ id: 1 });
      content.addText([{
        x: 10, y: 40, font: "F1", size: 12, text: "Hello World!"
      }]);
      content.addImage({ handle: 'I1', width: 20, height: 30, x: 40, y: 50 });
      expect(content).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      const content = Content({ id: 1 });
      content.addText([{
        x: 10, y: 40, font: "F1", size: 12, text: "Hello World!"
      }]);
      content.addImage({ handle: 'I1', width: 20, height: 30, x: 40, y: 50 });
      expect(content.toPDF({ deflate: false }).toString()).toMatchSnapshot();
    });
  });
});
