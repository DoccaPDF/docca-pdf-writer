import XRef from '../xref';
import Catalog from '../catalog';
import Trailer from '../trailer';

const xref = XRef({ startx: 105263,
  trailer: Trailer({
    ID: [ 'c7fbe2a37bce46eeaa1b16c7c84a7c08', 'c7fbe2a37bce46eeaa1b16c7c84a7c08' ],
    Size: 19,
    Info: {
      Title: 'My Title',
      Author: 'Me',
      Subject: 'Info Test',
      Keywords: 'test info',
      Creator: 'Jason',
      Producer: 'docca pdf writer',
      CreationDate: new Date('2017-02-13'),
      ModDate: new Date('2017-02-14'),
      Trapped: true,
      id: 18
    },
    Root: Catalog({ id: 2, Pages: { id: 3 } })
  }),
  offsets: {
    '1': 104443,
    '2': 104890,
    '3': 19
  }
});

describe('pdf-objects', () => {
  describe('xref', () => {
    it('creates a new object', () => {
      expect(xref).toMatchSnapshot();
    });

    it('returns a PDF object', () => {
      expect(xref.toPDF()).toMatchSnapshot();
    });
  });
});
