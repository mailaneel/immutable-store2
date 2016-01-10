'use strict';

exports.__esModule = true;
exports.updateIn = exports.update = exports.mergeDeepIn = exports.mergeDeep = exports.mergeIn = exports.merge = exports.setIn = exports.set = undefined;
exports.keys = keys;
exports.values = values;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSetAndMergerFn(method) {
        return function (map, key, val) {
                return map[method].apply(map, [key, (0, _utils.deepConvert)(val)]);
        };
}

function _createaUpdateFn(method) {
        return function (map) {
                function wrap(fn) {
                        return function (val) {
                                return (0, _utils.deepConvert)(fn(val));
                        };
                }

                for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        rest[_key - 1] = arguments[_key];
                }

                if (rest.length == 2) {
                        rest[1] = wrap(rest[1]);
                }

                if (rest.length === 3) {
                        rest[2] = wrap(rest[2]);
                }

                return map[method].apply(map, rest);
        };
}

function keys(map) {
        return map.keySeq().toJS();
}

function values(map) {
        return map.valueSeq().toJS();
}

//persistant changes
var set = exports.set = _createSetAndMergerFn('set');
var setIn = exports.setIn = _createSetAndMergerFn('setIn');
var merge = exports.merge = _createSetAndMergerFn('merge');
var mergeIn = exports.mergeIn = _createSetAndMergerFn('mergeIn');
var mergeDeep = exports.mergeDeep = _createSetAndMergerFn('mergeDeep');
var mergeDeepIn = exports.mergeDeepIn = _createSetAndMergerFn('mergeDeepIn');
var update = exports.update = _createaUpdateFn('update');
var updateIn = exports.updateIn = _createaUpdateFn('updateIn');