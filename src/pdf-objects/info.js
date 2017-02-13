import _isUndefined from 'lodash/isUnDefined';
import _map from 'lodash/map';
import _padStart from 'lodash/padStart';

function formatDate (date) {
  const parts = _map(['Date', 'Hours', 'Minutes', 'Seconds'], part =>
    _padStart(date[`getUTC${part}`](), 2, '0')
  );
  parts.unshift(_padStart(date.getUTCMonth() + 1, 2, '0'));
  parts.unshift(date.getUTCFullYear());
  return `${parts.join('')}Z`;
}

const info = {
  Type: 'Info',

  keys: [
    'Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer',
    'CreationDate', 'ModDate', 'Trapped'
  ],

  flattenKeys () {
    return this.keys.filter(key => !_isUndefined(this[key])).reduce((result, key) => {
      if (key === 'CreationDate' || key === 'ModDate') {
        result[key] = `(D:${formatDate(this[key])})`;
      } else if (key === 'Trapped') {
        result[key] = this[key] ? '/True' : '/False';
      } else {
        result[key] = `(${this[key]})`;
      }
      return result;
    }, {});
  }
};

/**
 * Info
 * @param {Object}  props
 * @param {Object}  props.Title
 * @param {Object}  props.Author
 * @param {Object}  props.Subject
 * @param {Object}  props.Keywords
 * @param {Object}  props.Creator
 * @param {Object}  props.Producer
 * @param {Object}  props.CreationDate
 * @param {Object}  props.ModDate
 * @param {Object}  props.Trapped
 */
export default function Info (props) {
  return Object.assign(Object.create(info), props);
}

