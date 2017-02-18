import fileType from 'file-type';
import getPNG from './png';
import getJPG from './jpg';

export default function Image (buffer) {
  let type = fileType(buffer);
  if (type) {
    if (type.ext === 'jpg') {
      return getJPG(buffer);
    } else if (type.ext === 'png') {
      return getPNG(buffer);
    }
  }
  throw (new Error(`Not a compatible file type: ${type.ext || 'unknown'}`));
};
