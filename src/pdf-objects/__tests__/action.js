import Action from '../action';

const uriAction = Action({
  S: 'URI', URI: 'http://docca.io'
});

const gotoAction = Action({
  S: 'GoTo', D: 'myDest'
});

describe('pdf-objects', () => {
  describe('URI Action', () => {
    it('creates a new object', () => {
      expect(uriAction).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(uriAction.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(uriAction.toPDF()).toMatchSnapshot();
    });
  });

  describe('GoTo Action', () => {
    it('creates a new object', () => {
      expect(gotoAction).toMatchSnapshot();
    });

    it('flattens keys values', () => {
      expect(gotoAction.flattenKeys()).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(gotoAction.toPDF()).toMatchSnapshot();
    });
  });
});
