
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
  let markup = [
    'q\nBT',
    `${text.x} ${text.y} Td`
  ];
  markup.push(`/${text.font} ${text.size} Tf`);
  markup.push(`(${text.text}) Tj`);
  markup.push('ET\nQ\n');
  return markup.join('\n');
}
