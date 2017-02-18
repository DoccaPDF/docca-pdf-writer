import fs from 'fs';

import Image from '../';

const pngBuffer = fs.readFileSync('./test/fixtures/docca-logo-alpha-tiny.png');

describe('image', () => {
  it('loads a png image', () => {
    return Image(pngBuffer)
    .then(image => {
      expect(image).toMatchSnapshot('splitAlpha image');
    });
  });
});
