import includes from 'lodash/includes';

const MARKERS = [
  0xFFC0, 0xFFC1, 0xFFC2, 0xFFC3, 0xFFC5, 0xFFC6, 0xFFC7,
  0xFFC8, 0xFFC9, 0xFFCA, 0xFFCB, 0xFFCC, 0xFFCD, 0xFFCE, 0xFFCF
];

export function readMeta (buffer) {
  if (buffer.readUInt16BE(0) !== 0xFFD8) {
    throw (new Error('SOI not found in JPEG'));
  }

  let pos = 2;
  let marker;

  while (pos < buffer.length) {
    marker = buffer.readUInt16BE(pos);
    pos += 2;
    if (includes(MARKERS, marker)) {
      break;
    }
    pos += buffer.readUInt16BE(pos);
  }
  if (!includes(MARKERS, marker)) {
    throw (new Error('Invalid JPEG.'));
  }

  return {
    depth: buffer[pos + 2],
    width: buffer.readUInt16BE(pos + 5),
    height: buffer.readUInt16BE(pos + 3),
    color: buffer[pos + 7]
  };
}

export default function getJPEG (buffer) {
  const meta = readMeta(buffer);
  const image = {
    Subtype: 'Image',
    Filter: 'DCTDecode',
    BitsPerComponent: meta.depth,
    Width: meta.width,
    Height: meta.height,
    ColorSpace: `Device${{ 1: 'Gray', 3: 'RGB', 4: 'CMYK' }[meta.color]}`,
    data: buffer
  };
  return Promise.resolve(image);
}
