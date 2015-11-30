'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.deepConvert = deepConvert;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

function deepConvert(val) {
	val = _immutable2['default'].fromJS(val);
	return _.isObject(val) && val['toJSON'] ? _immutable2['default'].fromJS(val.toJSON()) : val;
}