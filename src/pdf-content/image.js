
export function toString ({ handle, width, height, x, y }) {
  return `q
${width} 0 0 ${height} ${x} ${y - height} cm
/${handle} Do
Q\n`;
}

