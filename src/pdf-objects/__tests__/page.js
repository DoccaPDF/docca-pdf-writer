import Page from '../page';

describe('Page', () => {
  it('creates a new object', () => {
    const page = Page({ id: 1, Parent: { id: 10 } });
    expect(page.Type).toEqual('Page');
    expect(page).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Page'
    }));
  });

  it('flattens keys values', () => {
    const page = Page({
      id: 1,
      Parent: { id: 10 },
      Contents: [{ id: 3 }],
      MediaBox: [0, 0, 595, 840],
      Annots: [{ id: 4 }, { id: 5 }],
      Resources: { id: 6 }
    });
    expect(page.flattenKeys()).toEqual({
      "Annots": "[4 0 R 5 0 R]",
      "Contents": "[3 0 R]",
      "MediaBox": "[0 0 595 840]",
      "Parent": "10 0 R",
      "Resources": "6 0 R",
      "Type": "/Page"
    });
  });

  it('adds content', () => {
    const page = Page({ id: 1, Parent: { id: 10 } });
    page.addContent({ id: 3 });
    expect(page).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Page',
      Contents: [`3 0 R`]
    }));
  });

  it('sets resource', () => {
    const page = Page({ id: 1, Parent: { id: 10 } });
    page.setResources({ id: 4 });
    expect(page).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Page',
      Resources: `4 0 R`
    }));
  });

  it('sets mediabox', () => {
    const page = Page({ id: 1, Parent: { id: 10 } });
    page.setMediaBox([0, 0, 595, 840]);
    expect(page).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Page',
      "MediaBox": [0, 0, 595, 840]
    }));
  });

  it('adds annotations', () => {
    const page = Page({ id: 1, Parent: { id: 10 } });
    page.addAnnotation({ id: 4 });
    page.addAnnotation({ id: 5 });
    expect(page).toEqual(expect.objectContaining({
      id: 1,
      Type: 'Page',
      Annots: [`4 0 R`, `5 0 R`]
    }));
  });
});

// 8 0 obj
// <<
//   /Annots [
//   <<
//     /BS <<
//       /S /U
//       /Type /Border
//       /W 1
//     >>
//     /Border [ 0 0 1 ]
//     /C [ 0 0 1 ]
//     /Dest
//     /theDocument
//     /F 4
//     /H /N
//     /Rect [ 41 708.03509375 99.93359375 694.79290625 ]
//     /Subtype /Link
//     /Type /Annot
//   >>
//   ]
//   /Contents [ 34 0 R ]
//   /MediaBox [ 0 0 595 841.85 ]
//   /Parent 18 0 R
//   /Resources <<
//     /Font << /F1 20 0 R /F2 21 0 R >>
//     /ProcSet 23 0 R
//     /XObject << /img1 24 0 R >>
//   >>
//   /Type /Page
// >>
// endobj
