'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodashUniqueid = require('lodash.uniqueid');

var _lodashUniqueid2 = _interopRequireDefault(_lodashUniqueid);

var _lodashIsobject = require('lodash.isobject');

var _lodashIsobject2 = _interopRequireDefault(_lodashIsobject);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var Collection = (function (_Store) {
    _inherits(Collection, _Store);

    function Collection(state, options) {
        _classCallCheck(this, Collection);

        _Store.call(this, state, options = _lodashDefaults2['default'](options || {}, {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            type: 'collection'
        }));
    }

    //finders

    Collection.prototype._prepareItem = function _prepareItem(item) {
        var _defaults;

        return _lodashDefaults2['default'](item || {}, (_defaults = {}, _defaults[this.cidAttribute] = _lodashUniqueid2['default'](this.cidPrefix), _defaults));
    };

    Collection.prototype._getItemId = function _getItemId(item) {
        if (item instanceof _immutable2['default'].Map) {
            return item.get(this.idAttribute) || item.get(this.cidAttribute);
        }

        if (_lodashIsobject2['default'](item)) {
            return item.id | item.cid;
        }

        return item;
    };

    Collection.prototype.add = function add(item) {
        if (this.has(item)) {
            return this.update(this._getItemId(item), item);
        }

        item = this._prepareItem(item);
        this.setState(this.state.push(_immutable2['default'].Map(item)));
        return this;
    };

    Collection.prototype.update = function update(id, item) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this.add(item);
        }

        var newState = this.state.update(index, function (existingItem) {
            return existingItem.mergeDeep(item);
        });

        this.setState(newState);
        return this;
    };

    Collection.prototype.remove = function remove(id) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this;
        }

        this.setState(this.state.remove(index));
    };

    Collection.prototype.clear = function clear() {
        this.setState(this.state.clear());
    };

    Collection.prototype.has = function has(id) {
        return !!this.find(id);
    };

    _createClass(Collection, [{
        key: 'size',
        get: function get() {
            return this.state.size;
        }
    }]);

    return Collection;
})(_store2['default']);

['find', 'findIndex'].forEach(function (method) {
    Collection.prototype[method] = function (id) {
        var _this = this;

        id = this._getItemId(id);
        return this.state[method](function (item) {
            return item.get(_this.idAttribute) === id || item.get(_this.cidAttribute) === id;
        });
    };
});

['includes', 'contains', 'indexOf', 'toJS', 'toJSON', 'toArray', 'toObject'].forEach(function (method) {
    Collection.prototype[method] = function () {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        return this.state[method].apply(this.state, rest);
    };
});

exports['default'] = Collection;
module.exports = exports['default'];