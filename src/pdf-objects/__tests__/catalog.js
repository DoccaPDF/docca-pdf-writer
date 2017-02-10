import Catalog from '../catalog';

describe('pdf-objects', () => {
  describe('catalog', () => {
    it('creates a new object', () => {
      const content = Catalog({
        id: 2,
        Pages: { id: 3 }
      });
      expect(content).toEqual(expect.objectContaining({
        Type: 'Catalog',
        Pages: `3 0 R`
      }));
    });

    it('flattens keys values', () => {
      const content = Catalog({
        id: 2,
        Pages: { id: 3 }
      });
      expect(content.flattenKeys()).toEqual({
        Type: `/Catalog`,
        Pages: `3 0 R`
      });
    });
  });
});
