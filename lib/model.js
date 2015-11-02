'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var Model = (function (_Store) {
    _inherits(Model, _Store);

    function Model(state, options) {
        _classCallCheck(this, Model);

        _Store.call(this, state, _Object$assign(options || {}, {
            type: 'model'
        }));
    }

    // persistant changes
    return Model;
})(_store2['default']);

['set', 'delete', 'remove', 'clear', 'update', 'merge', 'mergeWith', 'mergeDeep', 'mergeDeepWith', 'setIn', 'deleteIn', 'removeIn', 'updateIn', 'mergeIn', 'mergeDeepIn'].forEach(function (method) {
    Model.prototype[method] = function () {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        this.setState(this.state[method].apply(this.state, rest));
        return this;
    };
});

//getters
['get', 'has', 'includes', 'contains', 'getIn', 'hasIn', 'toJS', 'toArray', 'toJSON', 'toObject', 'keys', 'values'].forEach(function (method) {
    Model.prototype[method] = function () {
        for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            rest[_key2] = arguments[_key2];
        }

        return this.state[method].apply(this.state, rest);
    };
});

exports['default'] = Model;
module.exports = exports['default'];