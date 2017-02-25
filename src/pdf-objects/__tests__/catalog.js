import Catalog from '../catalog';
import Names from '../names';

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
        Pages: { id: 3 },
        Names: Names()
      });
      content.addNameDest({ name: 'myDest', page: { id: 1 }, left: 10, top: 10, zoom: 2 });
      expect(content.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      const content = Catalog({
        id: 2,
        Pages: { id: 3 },
        Names: Names()
      });
      content.addNameDest({ name: 'myDest', page: { id: 1 }, left: 10, top: 10, zoom: 2 });
      expect(content.toPDF()).toMatchSnapshot();
    });
  });
});
