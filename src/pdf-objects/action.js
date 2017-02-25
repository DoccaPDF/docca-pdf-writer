import assert from 'assert';

import { _includes } from 'lodash/includes';

import asPdfDictionary from '../pdf-object-serialize/as-pdf-dictionary';

const action = {
  Type: 'Action',

  keys: [
    // common to all actions
    'Type', 'S', 'Next',

    // S: GoTo - Go to a destination in the current document.
    'D', // destination - name, string, or array

    // S: GoToR - (“Go-to remote”) Go to a destination in another document.
    // S: Launch - Launch an application, usually to open a file.
    // S: Thread - Begin reading an article thread.

    // S: URI - Resolve a uniform resource identifier.
    'URI',  // string
    'isMap' // boolean - track mouse position

    // S: Sound - (PDF 1.2) Play a sound.

    // S: Movie - (PDF 1.2) Play a movie.

    // S: Hide - (PDF 1.2) Set an annotation’s Hidden flag.

    // S: Named - (PDF 1.2) Execute an action predefined by the viewer application.

    // S: SubmitForm - (PDF 1.2) Send data to a uniform resource locator.

    // S: ResetForm - (PDF 1.2) Set fields to their default values.

    // S: ImportData - (PDF 1.2) Import field values from a file.

    // S: Javascript - (PDF 1.3) Execute a JavaScript script.
  ],

  flattenKeys () {
    return {
      Type: '/Action',
      S: `/${this.S}`,
      D: this.D && `(${this.D})`,
      URI: this.URI && `(${this.URI})`
      // Next:
    };
  },

  toPDF () {
    return asPdfDictionary(this);
  }

};

/**
 * create a new action object
 * @param {Object} props
 * @param {String} props.S      subtype URI | GoTo
 * @param {String} props.D      destination - if subtype is GoTo
 * @param {String} props.URI    uri - if subtype is URI
 */
export default function Action (props) {
  return Object.assign(Object.create(action), props);
}
