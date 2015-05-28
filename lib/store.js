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

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var Store = (function (_EventEmitter) {

    /**
     * @param options
     * @param {boolean} options.useLocalStorage
     * @param {*} options.collectionClass
     */

    function Store(options) {
        _classCallCheck(this, Store);

        _get(Object.getPrototypeOf(Store.prototype), 'constructor', this).call(this);
        options = _underscore2['default'].defaults(options || {}, {
            collectionClass: _collection2['default']
        });

        this.collectionClass = options.collectionClass;
        this.store = {};
    }

    _inherits(Store, _EventEmitter);

    _createClass(Store, [{
        key: 'collection',
        value: function collection(collectionName) {
            if (!this.store[collectionName]) {
                this.store[collectionName.toLowerCase()] = this.createCollection(collectionName);
            }

            return this.store[collectionName];
        }
    }, {
        key: 'createCollection',
        value: function createCollection(collectionName, options) {
            var collection = new this.collectionClass(collectionName, options);

            // all collection events should be triggered on store as well
            // so any one listening on store should be able to get collection events
            var store = this;
            collection.on('change', function () {
                setTimeout(function () {
                    store.emit('change', store, collection);
                    store.emit(collection.name + ':' + 'change', store, collection);
                    store.emit('change' + ':' + collection.name, store, collection);
                }, 0);
            });

            return collection;
        }
    }]);

    return Store;
})(_eventemitter32['default']);

exports['default'] = Store;
module.exports = exports['default'];