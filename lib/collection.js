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
    function Collection(data, options) {
        _classCallCheck(this, Collection);

        _EventEmitter.call(this);
        options = _underscore2['default'].defaults(options || {}, {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            bufferTime: 1, //in ms,
            name: _underscore2['default'].uniqueId('collection_')
        });

        this.name = options.name;
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

        if (data && _underscore2['default'].isArray(data)) {
            _underscore2['default'].each(data, _underscore2['default'].bind(this.insert, this));
        }
    }

    _inherits(Collection, _EventEmitter);

    Collection.isEqual = function isEqual(doc1, doc2) {
        return doc1 === doc2;
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

        if (this.has(doc)) {
            return this.update(doc);
        }

        if (!doc[this.cidAttribute]) {
            doc[this.cidAttribute] = _underscore2['default'].uniqueId(this.cidPrefix);
        }

        if (!_seamlessImmutable2['default'].isImmutable(doc)) {
            doc = (0, _seamlessImmutable2['default'])(doc);
        }

        this.__insert(doc);
        this._addIndex(doc);
        this._triggerChange();
        return doc;
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
            return this.insert(doc);
        }

        var newDoc = this.__update(existingDoc, existingDoc.merge(doc, { deep: true }));

        if (!Collection.isEqual(existingDoc, newDoc)) {
            this._updateIndex(newDoc);
            this._triggerChange();
        }

        return newDoc;
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

        var removed = this.__remove(doc);
        if (removed) {
            this._removeIndex(doc);
            this._triggerChange();
        }

        return removed;
    };

    Collection.prototype.clear = function clear() {
        this.__clear();
        this._triggerChange();
    };

    Collection.prototype.isCid = function isCid(id) {
        return _utils2['default'].isCid(id, this.cidPrefix);
    };

    Collection.prototype.isId = function isId(id) {
        return _utils2['default'].isId(id, this.cidPrefix);
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

    Collection.prototype.count = function count() {
        return this.data.length;
    };

    Collection.prototype.toJSON = function toJSON() {
        return _underscore2['default'].map(this.data, function (m) {
            return m.asMutable({ deep: true });
        });
    };

    Collection.prototype.__insert = function __insert(doc) {
        this.data.push(doc);
        return doc;
    };

    Collection.prototype.__update = function __update(oldDoc, newDoc) {
        if (!Collection.isEqual(oldDoc, newDoc)) {
            var index = this.findIndex(oldDoc);
            if (index !== -1) {
                this.data[index] = newDoc;
            }
        }

        return newDoc;
    };

    Collection.prototype.__remove = function __remove(doc) {
        var index = this.indexOf(doc);
        if (index !== -1) {
            this.data.splice(index, 1);
            return true;
        }

        return false;
    };

    Collection.prototype.__clear = function __clear() {
        this.data = [];
        return this;
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