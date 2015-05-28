'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _underscoreQuery = require('underscore-query');

var _underscoreQuery2 = _interopRequireDefault(_underscoreQuery);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _q = (0, _underscoreQuery2['default'])(_underscore2['default'], false);

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

        _get(Object.getPrototypeOf(Collection.prototype), 'constructor', this).call(this);
        options = _underscore2['default'].defaults(options || {}, {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            bufferTime: 1, //in ms,
            useLocalStorage: true // this will start using local storage if used with local store
        });

        this.name = name || _underscore2['default'].uniqueId('collection_');
        this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;
        this.useLocalStorage = options.useLocalStorage;

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

    _createClass(Collection, [{
        key: 'isCid',
        value: function isCid(id) {
            return _underscore2['default'].isString(id) && new RegExp(this.cidPrefix + '.+').test(id);
        }
    }, {
        key: 'isId',
        value: function isId(id) {
            return !this.isCid(id) && (_underscore2['default'].isString(id) || _underscore2['default'].isNumber(id));
        }
    }, {
        key: 'get',

        /**
         * @param {id|cid|doc} id
         * @returns {boolean|{}} false if doc does not exist
         */
        value: function get(id) {
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
        }
    }, {
        key: 'has',

        /**
         * @param {id|cid|doc} doc
         * @returns {boolean}
         */
        value: function has(doc) {
            return !_underscore2['default'].isEmpty(this.get(doc));
        }
    }, {
        key: 'insert',

        /**
         *
         * @param {doc} doc
         * @returns {*}
         */
        value: function insert(doc) {

            if (!_underscore2['default'].isObject(doc)) {
                throw new Error('doc must be object given ' + doc);
            }

            return !this.has(doc) ? this._insert(doc) : this.update(doc);
        }
    }, {
        key: 'update',

        /**
         *
         * @param {id|cid|doc} id
         * @param {doc} [doc]
         * @returns {*}
         */
        value: function update(id, doc) {

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

            var isChanged = false;
            var mergedDoc = existingDoc.merge(doc);
            if (mergedDoc !== existingDoc) {
                isChanged = true;
            }

            if (!isChanged) {
                return existingDoc;
            }

            var index = this.findIndex(existingDoc);
            if (index !== -1) {
                this.data[index] = mergedDoc;
            }

            this._updateIndex(mergedDoc);
            this._triggerChange();
            return mergedDoc;
        }
    }, {
        key: 'remove',

        /**
         *
         * @param {id|cid|doc} doc
         * @returns {boolean}
         */
        value: function remove(doc) {
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
        }
    }, {
        key: 'count',
        value: function count() {
            return this.data.length;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.data;
        }
    }, {
        key: '_prepareDoc',

        /**
         *
         * @param {doc} doc
         * @returns {*}
         * @private
         */
        value: function _prepareDoc(doc) {
            if (!doc[this.cidAttribute]) {
                doc[this.cidAttribute] = _underscore2['default'].uniqueId(this.cidPrefix);
            }

            if (!_seamlessImmutable2['default'].isImmutable(doc)) {
                doc = (0, _seamlessImmutable2['default'])(doc);
            }

            return doc;
        }
    }, {
        key: '_insert',

        /**
         *
         * @param {doc} doc
         * @returns {*}
         * @private
         */
        value: function _insert(doc) {
            doc = this._prepareDoc(doc);
            this.data.push(doc);
            this._addIndex(doc);
            this._triggerChange();
            return doc;
        }
    }, {
        key: '_ensureIndex',
        value: function _ensureIndex() {
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
        }
    }, {
        key: '_updateIndex',

        /**
         *
         * @param {doc} doc
         * @returns {Collection}
         * @private
         */
        value: function _updateIndex(doc) {
            this._removeIndex(doc);
            this._addIndex(doc);
            return this;
        }
    }, {
        key: '_addIndex',

        /**
         *
         * @param {doc} doc
         * @returns {Collection}
         * @private
         */
        value: function _addIndex(doc) {
            var self = this;
            _underscore2['default'].each(self.indexKeys, function (key) {
                if (!self.indexes[key]) {
                    self.indexes[key] = {};
                }
                self.indexes[key][doc[key]] = doc;
            });

            return this;
        }
    }, {
        key: '_removeIndex',

        /**
         *
         * @param {doc} doc
         * @returns {Collection}
         * @private
         */
        value: function _removeIndex(doc) {
            var self = this;
            _underscore2['default'].each(self.indexKeys, function (key) {
                if (self.indexes[key] && self.indexes[key][doc[key]]) {
                    delete self.indexes[key][doc[key]];
                }
            });

            return this;
        }
    }, {
        key: '_triggerChange',
        value: function _triggerChange() {
            if (!this._isBufferingEvents) {
                this._isBufferingEvents = true;
                var self = this;
                setTimeout(function () {
                    self._isBufferingEvents = false;
                    self.emit('change', self);
                }, this._bufferTime);
            }
        }
    }, {
        key: 'query',

        /**
         *
         * @param {{}} q
         * @returns {*}
         */
        value: function query(q) {
            return _q(this.data, q);
        }
    }, {
        key: 'build',
        value: function build() {
            return _q.build(this.data);
        }
    }]);

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