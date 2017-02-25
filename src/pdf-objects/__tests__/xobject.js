import XObject from '../xobject';

const xobject = XObject({
  id: 1,
  Subtype: 'Image',
  Filter: 'FlateDecode',
  BitsPerComponent: 8,
  Width: 100,
  Height: 20,
  ColorSpace: 'DeviceRGB',
  SMask: { id: 2 },
  data: 'fakeImageDate'
});

describe('pdf-objects', () => {
  describe('xobject', () => {
    it('creates a new object', () => {
      expect(xobject).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(xobject.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(xobject.toPDF()).toMatchSnapshot();
    });
  });
});
