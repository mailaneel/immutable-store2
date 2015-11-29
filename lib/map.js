'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.keys = keys;
exports.values = values;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('./utils');

function _createSetAndMergerFn(method) {
        return function (map, key, val) {
                return map[method].apply(map, [key, _utils.deepConvert(val)]);
        };
}

function _createaUpdateFn(method) {
        return function (map) {
                function wrap(fn) {
                        return function (val) {
                                return _utils.deepConvert(fn(val));
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
var set = _createSetAndMergerFn('set');
exports.set = set;
var setIn = _createSetAndMergerFn('setIn');
exports.setIn = setIn;
var merge = _createSetAndMergerFn('merge');
exports.merge = merge;
var mergeIn = _createSetAndMergerFn('mergeIn');
exports.mergeIn = mergeIn;
var mergeDeep = _createSetAndMergerFn('mergeDeep');
exports.mergeDeep = mergeDeep;
var mergeDeepIn = _createSetAndMergerFn('mergeDeepIn');
exports.mergeDeepIn = mergeDeepIn;
var update = _createaUpdateFn('update');
exports.update = update;
var updateIn = _createaUpdateFn('updateIn');
exports.updateIn = updateIn;