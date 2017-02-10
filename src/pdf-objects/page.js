import assert from 'assert';
import _forEach from 'lodash/forEach';
import _omit from 'lodash/omit';

import { arrayToString, ref } from './utils';

const page = {
  Type: 'Page',

  keys: [
    'Type', 'Parent', 'Contents', 'Resources', 'MetaData',
    'MediaBox', 'CropBox', 'BleedBox', 'TrimBox', 'ArtBox', 'BoxColorInfo',
    'PieceInfo', 'LastModified',
    'StructParents', 'Rotate', 'Group', 'Thumb', 'B', 'Dur', 'Trans',
    'AA', 'ID', 'PZ', 'SeparationInfo',
    'Annots'
  ],

  flattenKeys () {
    return {
      Type: '/Page',
      Parent: this.Parent,
      Contents: arrayToString(this.Contents),
      Annots: arrayToString(this.Annots),
      Resources: this.Resources,
      MediaBox: arrayToString(this.MediaBox)
    };
  },

  addAnnotation (obj) {
    if (!this.Annots) {
      this.Annots = [];
    }
    this.Annots.push(ref(obj));
  },

  /**
   * an array of streams
   * @param {Content} obj
   */
  addContent (obj) {
    this.Contents.push(ref(obj));
  },

  setResources (obj) {
    if (obj) {
      this.Resources = ref(obj);
    }
  },

  setMediaBox (obj) {
    if (obj) {
      this.MediaBox = obj;
    }
  }
};

export default function Page (props) {
  assert(props.id, `id is required`);
  assert(props.Parent, `Parent is required`);
  const initProps = _omit(props, 'Parent', 'Contents', 'Annots', 'Resources');
  const pageI = Object.assign(Object.create(page), initProps);

  pageI.Contents = [];
  pageI.Parent = ref(props.Parent);
  pageI.setResources(props.Resources);
  pageI.setMediaBox(props.MediaBox);

  _forEach(props.Annots, (kid) => pageI.addAnnotation(kid));
  _forEach(props.Contents, (content) => pageI.addContent(content));

  return pageI;
}
