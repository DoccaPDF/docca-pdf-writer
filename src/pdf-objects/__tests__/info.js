import Info from '../info';

describe('Info', () => {
  it('creates a new object', () => {
    const info = Info({ id: 1 });
    expect(info.Type).toEqual('Info');
    expect(info).toEqual(expect.objectContaining({ id: 1, Type: 'Info' }));
  });

  it('flattens keys values (all empty)', () => {
    const info = Info({ id: 1 });
    expect(info.flattenKeys()).toEqual({});
  });

  it('flattens keys values', () => {
    const info = Info({
      id: 1,
      Title: 'My Title',
      Author: 'Me',
      Subject: 'Info Test',
      Keywords: 'test info',
      Creator: 'Jason',
      Producer: 'docca pdf writer',
      CreationDate: new Date('2017-02-13T23:27:00'),
      ModDate: new Date('2017-02-13T23:28:00'),
      Trapped: true
    });
    expect(info.flattenKeys()).toEqual({
      "Author": "(Me)",
      "CreationDate": "(D:20170213232700Z)",
      "Creator": "(Jason)",
      "Keywords": "(test info)",
      "ModDate": "(D:20170213232800Z)",
      "Producer": "(docca pdf writer)",
      "Subject": "(Info Test)",
      "Title": "(My Title)",
      "Trapped": `/True`
    });
  });

  it('flattens keys values', () => {
    const info = Info({
      id: 1,
      Trapped: false
    });
    expect(info.flattenKeys()).toEqual({
      "Trapped": `/False`
    });
  });
});
