import _ from 'underscore';
import EventEmitter from 'eventemitter3';


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

export default class Collection extends EventEmitter {
    constructor(name, options) {
        super();
        options = _.defaults((options || {}), {
            idAttribute: "id",
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            bufferTime: 1 //in ms,
        });

        this.name = name || _.uniqueId('collection_');
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

    isCid(id) {
        return (_.isString(id) && (new RegExp(this.cidPrefix + '.+')).test(id));
    }

    isId(id) {
        return (!this.isCid(id) && (_.isString(id) || _.isNumber(id)));
    }

    /**
     * @param {id|cid|doc} id
     * @returns {boolean|{}} false if doc does not exist
     */
    get(id) {
        var doc = false;
        if (!_.isObject(id)) {
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

    /**
     * @param {id|cid|doc} doc
     * @returns {boolean}
     */
    has(doc) {
        return !(_.isEmpty(this.get(doc)));
    }

    /**
     *
     * @param {doc} doc
     * @returns {*}
     */
    insert(doc) {

        if (!_.isObject(doc)) {
            throw new Error('doc must be object given ' + doc);
        }

        return (!this.has(doc)) ? this._insert(doc) : this.update(doc);
    }

    /**
     *
     * @param {id|cid|doc} id
     * @param {doc} [doc]
     * @returns {*}
     */
    update(id, doc) {

        if (_.isObject(id)) {
            doc = id;
        }

        if (!_.isObject(doc)) {
            throw new Error('doc must be object given ' + doc)
        }

        var existingDoc = this.get(id);
        if (!existingDoc) {
            return this._insert(doc);
        }

        var mergedDoc = this._prepareDocForUpdate(existingDoc, doc);

        this._updateIndex(mergedDoc);
        this._triggerChange();
        return mergedDoc;
    }

    /**
     *
     * @param {id|cid|doc} doc
     * @returns {boolean}
     */
    remove(doc) {
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

    clear(){
        this.data = [];
        this._triggerChange();
    }

    count() {
        return this.data.length;
    }

    toJSON() {
        return this.data;
    }

    /**
     *
     * @param {doc} doc
     * @returns {*}
     * @private
     */
    _prepareDocForInsert(doc) {
        if (!doc[this.cidAttribute]) {
            doc[this.cidAttribute] = _.uniqueId(this.cidPrefix);
        }

        return doc;
    }

    _prepareDocForUpdate(existingDoc, newDoc){
       return _.extend(existingDoc, newDoc);
    }

    /**
     *
     * @param {doc} doc
     * @returns {*}
     * @private
     */
    _insert(doc) {
        doc = this._prepareDocForInsert(doc);
        this.data.push(doc);
        this._addIndex(doc);
        this._triggerChange();
        return doc
    }

    _ensureIndex() {
        var self = this;
        _.each(self.indexKeys, function (key) {
            if (!self.indexes[key]) {
                self.indexes[key] = {};
            }
        });


        _.each(self.data, function (item) {
            _.each(self.indexKeys, function (key) {
                if (item[key]) {
                    self.indexes[key][item[key]] = item;
                }
            });
        });
    }

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */
    _updateIndex(doc){
        this._removeIndex(doc);
        this._addIndex(doc);
        return this;
    }

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */
    _addIndex(doc) {
        var self = this;
        _.each(self.indexKeys, function (key) {
            if (!self.indexes[key]) {
                self.indexes[key] = {};
            }
            self.indexes[key][doc[key]] = doc;
        });

        return this;
    }

    /**
     *
     * @param {doc} doc
     * @returns {Collection}
     * @private
     */
    _removeIndex(doc) {
        var self = this;
        _.each(self.indexKeys, function (key) {
            if (self.indexes[key] && self.indexes[key][doc[key]]) {
                delete self.indexes[key][doc[key]];
            }
        });

        return this;
    }

    _triggerChange() {
        if (!this._isBufferingEvents) {
            this._isBufferingEvents = true;
            var self = this;
            setTimeout(function () {
                self._isBufferingEvents = false;
                self.emit('change', self);
            }, this._bufferTime);
        }
    }
}

_.each([
    'indexOf', 'lastIndexOf'
], function (method) {
    Collection.prototype[method] = function (object, ...rest) {
        rest.unshift(this.data, this.get(object));
        return _[method].apply(null, rest);
    }
});

_.each([
    'each', 'map', 'reduce', 'reduceRight',
    'find', 'filter', 'where', 'findWhere',
    'reject', 'every', 'some', 'contains', 'invoke', 'pluck',
    'max', 'min', 'sortBy', 'groupBy', 'indexBy', 'countBy', 'shuffle', 'sample',
    'toArray', 'partition',
    'first', 'initial', 'last', 'rest', 'findIndex', 'findLastIndex'
], function (method) {
    Collection.prototype[method] = function (...rest) {
        rest.unshift(this.data);
        return _[method].apply(null, rest);

    }
});