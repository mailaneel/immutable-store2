'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var Model = (function (_EventEmitter) {
    function Model(attrs, options) {
        _classCallCheck(this, Model);

        _EventEmitter.call(this);
        options = _underscore2['default'].defaults(options || {}, {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            name: _underscore2['default'].uniqueId('model_')
        });

        this.name = options.name;
        this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;

        this.data = (0, _seamlessImmutable2['default'])(this._getDefaultData());

        if (attrs) {
            this.set(attrs);
        }
    }

    _inherits(Model, _EventEmitter);

    Model.prototype._getDefaultData = function _getDefaultData() {
        var defaultData = {};
        defaultData[this.cidAttribute] = _underscore2['default'].uniqueId(this.cidPrefix);
        return defaultData;
    };

    Model.prototype.isCid = function isCid(id) {
        return _utils2['default'].isCid(id, this.cidPrefix);
    };

    Model.prototype.isId = function isId(id) {
        return _utils2['default'].isId(id, this.cidPrefix);
    };

    Model.prototype.set = function set(key, val) {

        var attrs = {};
        if (!_underscore2['default'].isObject(key)) {
            attrs[key] = val;
        } else {
            attrs = key;
        }

        var data = this.data.merge(attrs, { deep: true });

        if (data !== this.data) {
            this.data = data;
            this._triggerChange();
        }

        return this.data;
    };

    Model.prototype.get = function get(key) {
        return this.data[key];
    };

    Model.prototype.remove = function remove(key) {
        if (this.data[key] && key !== this.cidAttribute) {
            var data = this.data.asMutable();
            delete data[key];
            this.data = (0, _seamlessImmutable2['default'])(data);
            this._triggerChange();
        }

        return this.data;
    };

    Model.prototype.clear = function clear() {
        this.data = (0, _seamlessImmutable2['default'])(this._getDefaultData());
        this._triggerChange();
        return this.data;
    };

    Model.prototype._triggerChange = function _triggerChange() {
        this.emit('change', this);
    };

    Model.prototype.toJSON = function toJSON() {
        return this.data.asMutable({ deep: true });
    };

    return Model;
})(_eventemitter32['default']);

exports['default'] = Model;

_underscore2['default'].each(['keys', 'values', 'has'], function (method) {
    Model.prototype[method] = function () {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        rest.unshift(this.data);
        return _underscore2['default'][method].apply(null, rest);
    };
});
module.exports = exports['default'];