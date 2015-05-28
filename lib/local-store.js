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

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _store3 = require('store');

var _store4 = _interopRequireDefault(_store3);

var LocalStore = (function (_Store) {
    function LocalStore(options) {
        _classCallCheck(this, LocalStore);

        options = _underscore2['default'].defaults(options || {}, {
            namespace: 'local',
            separator: ':'
        });

        _get(Object.getPrototypeOf(LocalStore.prototype), 'constructor', this).call(this, options);

        this.namespace = options.namespace;
        this.separator = options.separator;
        this.bindLocalStorage();
    }

    _inherits(LocalStore, _Store);

    _createClass(LocalStore, [{
        key: 'removeNamespaceFromKey',
        value: function removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        }
    }, {
        key: 'addNamespaceToKey',
        value: function addNamespaceToKey(key) {
            return this.namespace + this.separator + key;
        }
    }, {
        key: 'bindLocalStorage',
        value: function bindLocalStorage() {

            if (!_store4['default'].enabled) {
                throw new Error('Local storage is not supported by your browser. ' + 'Please disable "Private Mode", or upgrade to a modern browser.');
            }

            var store = this;
            store.on('change', function (store, collection) {
                // only store to local storage if useLocalStorage flag is set to true on collection
                if (collection.useLocalStorage) {
                    _store4['default'].set(store.addNamespaceToKey(collection.name), collection.data);
                }
            });

            _store4['default'].forEach(function (collectionName, data) {
                collectionName = store.removeNamespaceFromKey(collectionName);
                if (collectionName) {
                    _underscore2['default'].each(data, function (doc) {
                        store.collection(collectionName).insert(doc);
                    });
                }
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            LocalStore.clear();
        }
    }], [{
        key: 'clear',
        value: function clear() {
            _store4['default'].clear();
        }
    }]);

    return LocalStore;
})(_store2['default']);

exports['default'] = LocalStore;
module.exports = exports['default'];