import fs from 'fs';

import { PNG as PNGjs } from 'pngjs';
import getPNG, { splitAlpha } from '../png';

const pngBuffer = fs.readFileSync('./test/fixtures/docca-logo-alpha-tiny.png');

describe('image', () => {
  describe('png', () => {
    describe('splitAlpha', () => {
      it('splits the alpha channel', () => {
        const png = PNGjs.sync.read(pngBuffer);
        const { image, alpha } = splitAlpha(png);
        expect(image).toMatchSnapshot('splitAlpha image');
        expect(alpha).toMatchSnapshot('splitAlpha alpha');
      });
    });

    describe('getPNG', () => {
      it('returns image as PDF objects', () => {
        return getPNG(pngBuffer)
        .then(image => expect(image).toMatchSnapshot());
      });
    });
  });
});
