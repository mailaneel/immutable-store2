'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = CollectionDecorator;

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

function CollectionDecorator(_Collection) {
    return (function (_Collection2) {
        function _Collection() {
            _classCallCheck(this, _Collection);

            if (_Collection2 != null) {
                _Collection2.apply(this, arguments);
            }
        }

        _inherits(_Collection, _Collection2);

        return _Collection;
    })(_collection2['default']);
}

module.exports = exports['default'];