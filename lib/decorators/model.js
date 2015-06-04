'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = ModelDecorator;

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

function ModelDecorator(_Model) {
    return (function (_Model2) {
        function _Model() {
            _classCallCheck(this, _Model);

            if (_Model2 != null) {
                _Model2.apply(this, arguments);
            }
        }

        _inherits(_Model, _Model2);

        return _Model;
    })(_model2['default']);
}

module.exports = exports['default'];