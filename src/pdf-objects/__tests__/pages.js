import Pages from '../pages';

describe('Pages', () => {
  it('creates a new object', () => {
    const pages = Pages({ id: 1 });
    expect(pages.Type).toEqual('Pages');
    expect(pages).toEqual(expect.objectContaining({ id: 1, Type: 'Pages' }));
  });

  it('flattens keys values', () => {
    const pages = Pages({
      id: 1,
      Kids: [{ id: 2 }, { id: 3 }]
    });
    expect(pages.flattenKeys()).toEqual({
      "Count": "2",
      "Kids": "[2 0 R 3 0 R]",
      "Type": "/Pages"
    });
  });

  it('adds a page', () => {
    const pages = Pages({ id: 1 });
    pages.addPage({ id: 2, Type: 'Page' });
    pages.addPage({ id: 3, Type: 'Page' });
    expect(pages).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Pages',
      Kids: ["2 0 R", "3 0 R"]
    }));
  });
});
