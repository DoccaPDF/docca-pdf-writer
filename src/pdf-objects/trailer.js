import { ref } from './utils';
import _omit from 'lodash/omit';

const trailer = {
  Type: 'Trailer',

  keys: ['Size', 'Root', 'ID'],

  flattenKeys () {
    return {
      Size: this.Size,
      Root: this.Root,
      ID: `[<${this.ID.join('><')}>]`
    };
  },

  setRoot (obj) {
    this.Root = ref(obj);
  }
};

/**
 * Trailer
 * @param {Object}  props
 * @param {Number}  props.Size
 * @param {Catalog} props.Root
 * @param {Info}    props.Info
 * @param {Array}   props.ID
 */
export default function Trailer (props) {
  const initProps = _omit(props, 'Root');
  const trailerI = Object.assign(Object.create(trailer), initProps);
  trailerI.setRoot(props.Root);
  return trailerI;
}
