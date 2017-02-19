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

/**
 * get pdf image data Object
 * @param {Object} pngjsInstance
 * @param {Object} props
 * @param {Object} props.data  image data (required)
 * any object property can be overridden by including it in props
 */
export function pdfImageData (pngjsInstance, props) {
  return {
    Subtype: 'Image',
    Filter: 'FlateDecode',
    BitsPerComponent: pngjsInstance.depth,
    Width: pngjsInstance.width,
    Height: pngjsInstance.height,
    ColorSpace: pngjsInstance.color ? 'DeviceRGB' : 'DeviceGray',
    ...props
  };
}

/**
 * deflate image data with zlib
 * @param {Buffer}  image
 */
export function deflate (image) {
  return new Promise((resolve, reject) => {
    zlib.deflate(image, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

/**
 * returns PDF image data for a PNG
 * @param {Buffer}    png image data
 * @returns {Object}  PDF object data
 */
export default function getPNG (buffer) {
  const png = PNGjs.sync.read(buffer);
  const channels = splitAlpha(png);
  return deflate(channels.image)
  .then(data => {
    const image = pdfImageData(png, { data });
    if (channels.alpha) {
      return deflate(channels.alpha)
      .then(alphaData => {
        image.SMask = pdfImageData(png, { data: alphaData, ColorSpace: 'DeviceGray' });
        return image;
      });
    }
    return image;
  });
}
