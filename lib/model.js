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

var _lodashIsobject = require('lodash.isobject');

var _lodashIsobject2 = _interopRequireDefault(_lodashIsobject);

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

    Model.prototype.keys = function keys() {
        return this.state.keySeq().toJS();
    };

    Model.prototype.values = function values() {
        return this.state.valueSeq().toJS();
    };

    return Model;
})(_store2['default']);

['set', 'setIn', 'merge', 'mergeIn', 'mergeDeep', 'mergeDeepIn'].forEach(function (method) {
    Model.prototype[method] = function (key, val) {
        this.setState(this.state[method].apply(this.state, [key, this._deepConvert(val)]));
        return this;
    };
});

// persistant changes
['update', 'updateIn'].forEach(function (method) {
    Model.prototype[method] = function () {

        var self = this;
        function wrap(fn) {
            return function (val) {
                return self._deepConvert(fn(val));
            };
        }

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (args.length == 2) {
            args[1] = wrap(args[1]);
        }

        if (args.length === 3) {
            args[2] = wrap(args[2]);
        }

        this.setState(this.state[method].apply(this.state, args));
        return this;
    };
});

// persistant changes
['delete', 'remove', 'clear', 'deleteIn', 'removeIn'].forEach(function (method) {
    Model.prototype[method] = function () {
        for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            rest[_key2] = arguments[_key2];
        }

        this.setState(this.state[method].apply(this.state, rest));
        return this;
    };
});

//getters
['get', 'has', 'includes', 'contains', 'getIn', 'hasIn', 'toJS', 'toArray', 'toJSON', 'toObject'].forEach(function (method) {
    Model.prototype[method] = function () {
        for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            rest[_key3] = arguments[_key3];
        }

        return this.state[method].apply(this.state, rest);
    };
});

exports['default'] = Model;
module.exports = exports['default'];