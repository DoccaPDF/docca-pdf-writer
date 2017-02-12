
function single (text) {
  let markup = [
    `BT\n${text.x} ${text.y} Td`
  ];
  markup.push(`(${text.text}) Tj\nET`);
  return markup.join('\n');
}

function setToString (set) {
  return [
    `/${set[0].font} ${set[0].size} Tf`,
    set.map(single).join('\n')
  ].join('\n');
}

/**
 * format a text object as a string of PDF operations
 * @param   {Object} text       defines location, font, and text
 * @param   {Number} text.x     place the text x points from the left
 * @param   {Number} text.y     place the text y points from the bottom
 * @param   {String} text.font  the font handle defined in the resources of the page
 * @param   {Number} text.size  the size of font to use
 * @param   {String} text.text  the text
 * @returns {String} PDF operations
 * this should be modified to accept an array of text objects
 */
export function textToString (text) {
  let sets = [];
  let lineSet = [];
  let style = null;
  text.forEach(line => {
    const lineStyle = `${line.font} ${line.size}`;
    if (style) {
      if (lineStyle !== style) {
        sets.push(lineSet);
        lineSet = [line];
        style = lineStyle;
        return;
      }
    } else {
      style = lineStyle;
    }
    lineSet.push(line);
  });
  sets.push(lineSet);

  return [
    `q`,
    sets.map(setToString).join('\n'),
    `Q\n`
  ].join('\n');
}
