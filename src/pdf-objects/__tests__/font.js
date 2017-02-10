import Font from '../font';

describe('pdf-objects', () => {
  describe('font', () => {
    it('creates a new object', () => {
      const content = Font({
        id: 2,
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding',
        BaseFont: 'Helvetica'
      });
      expect(content).toEqual(expect.objectContaining({
        Type: 'Font',
        id: 2,
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding',
        BaseFont: 'Helvetica'
      }));
    });

    it('flattens keys values', () => {
      const content = Font({
        id: 2,
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding',
        BaseFont: 'Helvetica'
      });
      expect(content.flattenKeys()).toEqual({
        Type: '/Font',
        Subtype: '/Type1',
        Encoding: '/WinAnsiEncoding',
        BaseFont: '/Helvetica'
      });
    });
  });
});
