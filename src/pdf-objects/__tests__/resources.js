import Resources from '../resources';

const resources = Resources({
  id: 2,
  ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
  Font: { F1: { id: 3 } },
  XObject: { X1: { id: 5 } }
});

describe('pdf-objects', () => {
  describe('resources', () => {
    it('creates a new object', () => {
      expect(resources).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(resources.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(resources.toPDF()).toMatchSnapshot();
    });
  });
});
