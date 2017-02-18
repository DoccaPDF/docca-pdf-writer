import { PNG as PNGjs } from 'pngjs';
import zlib from 'zlib';

/**
 * returns image data and alpha channel data in separate buffers
 * @param   {Object} png  an instance of pngjs
 * @returns {Object} obj
 * @returns {Buffer} obj.image  image data
 * @returns {Buffer} obj.alpha  alpha channel data
 */
export function splitAlpha (png) {
  const image = new Buffer(png.width * png.height * 3);
  let alpha = new Buffer(png.width * png.height);
  let hasAlpha = false;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const srcIdx = (png.width * y + x) << 2;
      const targetIdx = (png.width * y + x) * 3;
      const alphaTargetIdx = (png.width * y + x);
      image[targetIdx] = png.data[srcIdx];
      image[targetIdx + 1] = png.data[srcIdx + 1];
      image[targetIdx + 2] = png.data[srcIdx + 2];
      alpha[alphaTargetIdx] = png.data[srcIdx + 3];
      if (alpha[alphaTargetIdx] < 255) {
        hasAlpha = true;
      }
    }
  }
  if (!hasAlpha) {
    alpha = null;
  }
  return { image, alpha };
}

export default function getPNG (buffer) {
  const png = PNGjs.sync.read(buffer);
  const channels = splitAlpha(png);
  return new Promise((resolve, reject) => {
    zlib.deflate(channels.image, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
  .then(data => {
    const image = {
      Subtype: 'Image',
      Filter: 'FlateDecode',
      BitsPerComponent: png.depth,
      Width: png.width,
      Height: png.height,
      ColorSpace: png.color ? 'DeviceRGB' : 'DeviceGray',
      data
    };
    if (channels.alpha) {
      return new Promise((resolve, reject) => {
        zlib.deflate(channels.alpha, (err, alphaData) => {
          if (err) {
            reject(err);
          }
          resolve(alphaData);
        });
      })
      .then(alphaData => {
        const smask = {
          Subtype: 'Image',
          Filter: 'FlateDecode',
          BitsPerComponent: 8,
          Width: png.width,
          Height: png.height,
          ColorSpace: 'DeviceGray',
          data: zlib.deflateSync(channels.alpha)
        };
        image.SMask = smask;
        return image;
      });
    }
    return image;
  });
}
