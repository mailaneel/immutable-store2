'use strict';

exports.__esModule = true;
exports.deepConvert = deepConvert;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _isObject = require('lodash/lang/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deepConvert(val) {
	val = _immutable2.default.fromJS(val);
	return (0, _isObject2.default)(val) && val['toJSON'] ? _immutable2.default.fromJS(val.toJSON()) : val;
}