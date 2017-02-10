import Resources from '../resources';

describe('pdf-objects', () => {
  describe('resources', () => {
    it('creates a new object', () => {
      const resources = Resources({
        id: 2,
        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
        Font: { F1: { id: 3 } }
      });
      expect(resources).toEqual(expect.objectContaining({
        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
        Font: { F1: '3 0 R' }
      }));
    });

    it('flattens keys values', () => {
      const resources = Resources({
        id: 2,
        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
        Font: { F1: { id: 3 } }
      });
      expect(resources.flattenKeys()).toEqual({
        ProcSet: `[ /PDF /Text /ImageB /ImageC /ImageI ]`,
        Font: `<<
/F1 3 0 R
>>
`,
        XObject: undefined
      });
    });
  });
});
