'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = Collection;

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function Collection(_CollectionClass) {
    return (function (_CollectionClass2) {
        function _CollectionClass() {
            _classCallCheck(this, _CollectionClass);

            if (_CollectionClass2 != null) {
                _CollectionClass2.apply(this, arguments);
            }
        }

        _inherits(_CollectionClass, _CollectionClass2);

        return _CollectionClass;
    })(_collection2['default']);
}

module.exports = exports['default'];