import Border from '../border';

const border = Border({
  W: 2, S: 'S'
});

describe('pdf-objects', () => {
  describe('border', () => {
    it('creates a new object', () => {
      expect(border).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(border.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(border.toPDF()).toMatchSnapshot();
    });
  });
});
