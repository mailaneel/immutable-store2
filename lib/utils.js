'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.deepConvert = deepConvert;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function deepConvert(val) {
	val = _immutable2['default'].fromJS(val);
	return _lodash2['default'].isObject(val) && val['toJSON'] ? _immutable2['default'].fromJS(val.toJSON()) : val;
}