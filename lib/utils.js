'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var utils = {
    isCid: function isCid(id, cidPrefix) {
        return _underscore2['default'].isString(id) && new RegExp(cidPrefix + '.+').test(id);
    },

    isId: function isId(id, cidPrefix) {
        return !this.isCid(id, cidPrefix) && (_underscore2['default'].isString(id) || _underscore2['default'].isNumber(id));
    }
};

exports['default'] = utils;
module.exports = exports['default'];