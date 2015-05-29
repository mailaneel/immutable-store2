'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var Store = (function (_EventEmitter) {
    function Store() {
        _classCallCheck(this, Store);

        _EventEmitter.call(this);
        this.collections = {};
    }

    _inherits(Store, _EventEmitter);

    Store.prototype.clear = function clear() {
        _underscore2['default'].each(this.collections, function (collection) {
            collection.clear();
        });
    };

    Store.prototype.collection = function collection(collectionName) {
        if (!collectionName || !this.collections[collectionName]) {
            throw new Error('collection does not exist');
        }

        return this.collections[collectionName];
    };

    Store.prototype.registerCollection = function registerCollection(collection) {
        this.collections[collection.name] = collection;
        this.bindEvents(collection);

        return collection;
    };

    Store.prototype.bindEvents = function bindEvents(collection) {
        var store = this;
        // all collection events should be triggered on store as well
        // so any one listening on store should be able to get collection events
        collection.on('change', function () {
            setTimeout(function () {
                store.emit('change', store, collection);
                store.emit(collection.name + ':' + 'change', store, collection);
                store.emit('change' + ':' + collection.name, store, collection);
            }, 0);
        });
    };

    return Store;
})(_eventemitter32['default']);

exports['default'] = Store;
module.exports = exports['default'];