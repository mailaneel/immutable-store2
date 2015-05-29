import _ from 'underscore';
import SeamlessImmutable from 'seamless-immutable';

/**
 * Immutable should be first decorator where ever possible
 * @param Collection
 * @returns {*}
 * @constructor
 */
export default function Immutable(Collection) {

   return  class ImmutableCollection extends Collection{
        _prepareDocForInsert(doc){
            doc = super._prepareDocForInsert(doc);
            if (!SeamlessImmutable.isImmutable(doc)) {
                doc = SeamlessImmutable(doc);
            }

            return doc;
        }

        _prepareDocForUpdate(existingDoc, newDoc){
            var mergedDoc = existingDoc.merge(newDoc)
            var index = this.findIndex(existingDoc);
            if (index !== -1) {
                this.data[index] = mergedDoc;
            }

            return mergedDoc;
        }
    }
}