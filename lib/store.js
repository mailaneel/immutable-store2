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

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var Store = (function (_EventEmitter) {
    function Store() {
        _classCallCheck(this, Store);

        _get(Object.getPrototypeOf(Store.prototype), 'constructor', this).call(this);
        this.collections = {};
    }

    _inherits(Store, _EventEmitter);

    _createClass(Store, [{
        key: 'clear',
        value: function clear() {
            _underscore2['default'].each(this.collections, function (collection) {
                collection.clear();
            });
        }
    }, {
        key: 'collection',
        value: function collection(collectionName) {
            if (!collectionName || !this.collections[collectionName]) {
                throw new Error('collection does not exist');
            }

            return this.collections[collectionName];
        }
    }, {
        key: 'registerCollection',
        value: function registerCollection(collection) {
            this.collections[collection.name] = collection;
            this.bindEvents(collection);

            return collection;
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents(collection) {
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
        }
    }]);

    return Store;
})(_eventemitter32['default']);

exports['default'] = Store;
module.exports = exports['default'];