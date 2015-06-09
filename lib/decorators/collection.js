'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = CollectionDecorator;

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

function CollectionDecorator(_Collection) {
    var C = (function (_Collection2) {
        function C() {
            _classCallCheck(this, C);

            if (_Collection2 != null) {
                _Collection2.apply(this, arguments);
            }
        }

        _inherits(C, _Collection2);

        return C;
    })(_collection2['default']);

    return;
}

module.exports = exports['default'];