import Trailer from '../trailer';

describe('pdf-objects', () => {
  describe('trailer', () => {
    it('creates a new object', () => {
      const content = Trailer({
        ID: ['213', '213'],
        Size: 34,
        Root: { id: 4 }
      });
      expect(content).toEqual(expect.objectContaining({
        Type: 'Trailer',
        ID: ['213', '213'],
        Root: `4 0 R`
      }));
    });

    it('flattens keys values', () => {
      const content = Trailer({
        ID: ['213', '213'],
        Size: 34,
        Root: { id: 4 }
      });
      expect(content.flattenKeys()).toEqual({
        ID: `[<213><213>]`,
        Size: 34,
        Root: `4 0 R`
      });
    });
  });
});
