'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

/**
 *
 * @typedef {string|number} id
 */

/**
 * @typedef {string|number} cid
 */

/**
 * @typedef {{}} doc
 */

var Collection = (function (_EventEmitter) {
    function Collection(name, options) {
        _classCallCheck(this, Collection);

        _EventEmitter.call(this);
        options = _underscore2['default'].defaults(options || {}, {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            bufferTime: 1 //in ms,
        });

        this.name = name || _underscore2['default'].uniqueId('collection_');
        this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;

        // we buffer events for predefined time instead of firing change events straight away
        this._isBufferingEvents = false;
        this._bufferTime = options.bufferTime;

        // values of this key should be unique
        this.indexKeys = [this.idAttribute, this.cidAttribute];
        this.indexes = {};

        this.data = [];
        this._ensureIndex();
    }

    _inherits(Collection, _EventEmitter);

    Collection.prototype.isCid = function isCid(id) {
        return _underscore2['default'].isString(id) && new RegExp(this.cidPrefix + '.+').test(id);
    };

    Collection.prototype.isId = function isId(id) {
        return !this.isCid(id) && (_underscore2['default'].isString(id) || _underscore2['default'].isNumber(id));
    };

    /**
     * @param {id|cid|doc} id
     * @returns {boolean|{}} false if doc does not exist
     */

    Collection.prototype.get = function get(id) {
        var doc = false;
        if (!_underscore2['default'].isObject(id)) {
            if (this.isCid(id)) {
                doc = this.indexes[this.cidAttribute][id];
            } else if (this.isId(id)) {
                doc = this.indexes[this.idAttribute][id];
            }
        } else {
            if (id[this.idAttribute]) {
                doc = this.indexes[this.idAttribute][id[this.idAttribute]];
            } else if (id[this.cidAttribute]) {
                doc = this.indexes[this.cidAttribute][id[this.cidAttribute]];
            }
        }

        return doc;
    };

    /**
     * @param {id|cid|doc} doc
     * @returns {boolean}
     */

    Collection.prototype.has = function has(doc) {
        return !_underscore2['default'].isEmpty(this.get(doc));
    };

    /**
     *
     * @param {doc} doc
     * @returns {*}
     */

    Collection.prototype.insert = function insert(doc) {

        if (!_underscore2['default'].isObject(doc)) {
            throw new Error('doc must be object given ' + doc);
        }

        return !this.has(doc) ? this._insert(doc) : this.update(doc);
    };

    /**
     *
     * @param {id|cid|doc} id
     * @param {doc} [doc]
     * @returns {*}
     */

    Collection.prototype.update = function update(id, doc) {

        if (_underscore2['default'].isObject(id)) {
            doc = id;
        }

        if (!_underscore2['default'].isObject(doc)) {
            throw new Error('doc must be object given ' + doc);
        }

        var existingDoc = this.get(id);
        if (!existingDoc) {
            return this._insert(doc);
        }

        var mergedDoc = this._prepareDocForUpdate(existingDoc, doc);

        this._updateIndex(mergedDoc);
        this._triggerChange();
        return mergedDoc;
    };

    /**
     *
     * @param {id|cid|doc} doc
     * @returns {boolean}
     */

    Collection.prototype.remove = function remove(doc) {
        doc = this.get(doc);
        if (!doc) {
            return false;
        }

        var index = this.indexOf(doc);
        if (index !== -1) {
            this.data.splice(index, 1);
            this._removeIndex(doc);
            this._triggerChange();
            return true;
        }

        return false;
    };

    Collection.prototype.clear = function clear() {
        this.data = [];
        this._triggerChange();
    };

    Collection.prototype.count = function count() {
        return this.data.length;
    };

    Collection.prototype.toJSON = function toJSON() {
        return this.data;
    };

    /**
     *
     * @param {doc} doc
     * @returns {*}
     * @private
     */

    Collection.prototype._prepareDocForInsert = function _prepareDocForInsert(doc) {
        if (!doc[this.cidAttribute]) {
            doc[this.cidAttribute] = _underscore2['default'].uniqueId(this.cidPrefix);
        }

        return doc;
    };

    Collection.prototype._prepareDocForUpdate = function _prepareDocForUpdate(existingDoc, newDoc) {
        return _underscore2['default'].extend(existingDoc, newDoc);
    };

    /**
     *
     * @param {doc} doc
     * @returns {*}
     * @private
     */

    Collection.prototype._insert = function _insert(doc) {
        doc = this._prepareDocForInsert(doc);
        this.data.push(doc);
        this._addIndex(doc);
        this._triggerChange();
        return doc;
    };

    Collection.prototype._ensureIndex = function _ensureIndex() {
        var self = this;
        _underscore2['default'].each(self.indexKeys, function (key) {
            if (!self.indexes[key]) {
                self.indexes[key] = {};
            }
        });

        _underscore2['default'].each(self.data, function (item) {
            _underscore2['default'].each(self.indexKeys, function (key) {
                if (item[key]) {
                    self.indexes[key][item[key]] = item;
                }
            });
        });
    };

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */

    Collection.prototype._updateIndex = function _updateIndex(doc) {
        this._removeIndex(doc);
        this._addIndex(doc);
        return this;
    };

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */

    Collection.prototype._addIndex = function _addIndex(doc) {
        var self = this;
        _underscore2['default'].each(self.indexKeys, function (key) {
            if (!self.indexes[key]) {
                self.indexes[key] = {};
            }
            self.indexes[key][doc[key]] = doc;
        });

        return this;
    };

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */

    Collection.prototype._removeIndex = function _removeIndex(doc) {
        var self = this;
        _underscore2['default'].each(self.indexKeys, function (key) {
            if (self.indexes[key] && self.indexes[key][doc[key]]) {
                delete self.indexes[key][doc[key]];
            }
        });

        return this;
    };

    Collection.prototype._triggerChange = function _triggerChange() {
        if (!this._isBufferingEvents) {
            this._isBufferingEvents = true;
            var self = this;
            setTimeout(function () {
                self._isBufferingEvents = false;
                self.emit('change', self);
            }, this._bufferTime);
        }
    };

    return Collection;
})(_eventemitter32['default']);

exports['default'] = Collection;

_underscore2['default'].each(['indexOf', 'lastIndexOf'], function (method) {
    Collection.prototype[method] = function (object) {
        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
        }

        rest.unshift(this.data, this.get(object));
        return _underscore2['default'][method].apply(null, rest);
    };
});

_underscore2['default'].each(['each', 'map', 'reduce', 'reduceRight', 'find', 'filter', 'where', 'findWhere', 'reject', 'every', 'some', 'contains', 'invoke', 'pluck', 'max', 'min', 'sortBy', 'groupBy', 'indexBy', 'countBy', 'shuffle', 'sample', 'toArray', 'partition', 'first', 'initial', 'last', 'rest', 'findIndex', 'findLastIndex'], function (method) {
    Collection.prototype[method] = function () {
        for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            rest[_key2] = arguments[_key2];
        }

        rest.unshift(this.data);
        return _underscore2['default'][method].apply(null, rest);
    };
});
module.exports = exports['default'];