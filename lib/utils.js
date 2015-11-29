'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.deepConvert = deepConvert;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodashIsobject = require('lodash.isobject');

var _lodashIsobject2 = _interopRequireDefault(_lodashIsobject);

function deepConvert(val) {
	val = _immutable2['default'].fromJS(val);
	return _lodashIsobject2['default'](val) && val['toJSON'] ? _immutable2['default'].fromJS(val.toJSON()) : val;
}