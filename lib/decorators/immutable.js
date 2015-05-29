'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = Immutable;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

/**
 * Immutable should be first decorator where ever possible
 * @param Collection
 * @returns {*}
 * @constructor
 */

function Immutable(Collection) {
    return (function (_Collection) {
        function ImmutableCollection() {
            _classCallCheck(this, ImmutableCollection);

            if (_Collection != null) {
                _Collection.apply(this, arguments);
            }
        }

        _inherits(ImmutableCollection, _Collection);

        ImmutableCollection.prototype._prepareDocForInsert = function _prepareDocForInsert(doc) {
            doc = _Collection.prototype._prepareDocForInsert.call(this, doc);
            if (!_seamlessImmutable2['default'].isImmutable(doc)) {
                doc = (0, _seamlessImmutable2['default'])(doc);
            }

            return doc;
        };

        ImmutableCollection.prototype._prepareDocForUpdate = function _prepareDocForUpdate(existingDoc, newDoc) {
            var mergedDoc = existingDoc.merge(newDoc);
            var index = this.findIndex(existingDoc);
            if (index !== -1) {
                this.data[index] = mergedDoc;
            }

            return mergedDoc;
        };

        return ImmutableCollection;
    })(Collection);
}

module.exports = exports['default'];