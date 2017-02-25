import Annot from '../annot';
import Action from '../action';

const action = Action({
  S: 'URI', URI: 'http://docca.io'
});

const annot = Annot({
  id: 42,
  A: action,
  Subtype: 'Link',
  Rect: [10, 20, 30, 40],
  H: 'I'
});

describe('pdf-objects', () => {
  describe('annot', () => {
    it('creates a new object', () => {
      expect(annot).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(annot.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(annot.toPDF()).toMatchSnapshot();
    });
  });
});
