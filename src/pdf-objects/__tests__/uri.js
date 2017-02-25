import URI from '../uri';

const uri = URI({ id: 42, Base: 'http://docca.io' });

describe('pdf-objects', () => {
  describe('uri', () => {
    it('creates a new object', () => {
      expect(uri).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(uri.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(uri.toPDF()).toMatchSnapshot();
    });
  });
});
