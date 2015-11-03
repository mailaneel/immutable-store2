'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

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

        _Store.call(this, state, _Object$assign(options || {}, {
            type: 'collection'
        }));
    }

    //finders

    Collection.prototype._prepareItem = function _prepareItem(item) {
        var _defaults;

        if (item instanceof _immutable2['default'].Map) {
            return !item.has(this.cidAttribute) ? item.set(this.cidAttribute, _lodashUniqueid2['default'](this.cidPrefix)) : item;
        }

        return _lodashDefaults2['default'](item || {}, (_defaults = {}, _defaults[this.cidAttribute] = _lodashUniqueid2['default'](this.cidPrefix), _defaults));
    };

    Collection.prototype._getItemId = function _getItemId(item) {
        if (item instanceof _immutable2['default'].Map) {
            //check if we have id first and then client id
            return item.get(this.idAttribute) || item.get(this.cidAttribute);
        }

        if (_lodashIsobject2['default'](item)) {
            return item.id || item.cid;
        }

        return item;
    };

    Collection.prototype._add = function _add(item) {
        if (this.has(item)) {
            return this._update(this._getItemId(item), item);
        }

        item = this._prepareItem(item);
        this.setState(this.state.push(this._deepConvert(item)));
        return this;
    };

    /**
     * item or array or items can be given
     * change will only be fired once
     * 
     * @param {{}|[{}]} items
     */

    Collection.prototype.add = function add(items) {
        var _this = this;

        if (Array.isArray(items)) {
            items.forEach(function (item) {
                return _this._add(item);
            });
        } else {
            this._add(items);
        }

        return this;
    };

    Collection.prototype._update = function _update(id, item) {
        var _this2 = this;

        var index = this.findIndex(id);
        if (index === -1) {
            return this._add(item);
        }

        var newState = this.state.update(index, function (existingItem) {
            return existingItem.mergeDeep(_this2._deepConvert(item));
        });

        this.setState(newState);
        return this;
    };

    /**
     * 
     * @param {{}|[{}]|string|number} id if given item or list of items second parameter is optional, if id of item is given second parameter is required
     * @param {{}} [item] item to update
     */

    Collection.prototype.update = function update(id, item) {
        var _this3 = this;

        if (arguments.length == 1) {
            if (Array.isArray(id)) {
                id.forEach(function (itemToUpdate) {
                    return _this3._update(itemToUpdate, itemToUpdate);
                });
            } else {
                this._update(id, id);
            }
        }

        if (arguments.length == 2) {
            this._update(id, item);
        }

        return this;
    };

    /**
     * @param {string|number|{}} id
     */

    Collection.prototype.remove = function remove(id) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this;
        }

        this.setState(this.state.remove(index));
        return this;
    };

    Collection.prototype.clear = function clear() {
        this.setState(this.state.clear());
        return this;
    };

    /**
     * @param {string|number|{}} id
     * @returns {boolean}
     */

    Collection.prototype.has = function has(id) {
        return !!this.find(id);
    };

    /**
     * @returns {number} size of collection
     */

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
        var _this4 = this;

        id = this._getItemId(id);
        return this.state[method](function (item) {
            return item.get(_this4.idAttribute) === id || item.get(_this4.cidAttribute) === id;
        });
    };
});

//getters
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