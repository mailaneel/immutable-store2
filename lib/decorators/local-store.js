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

exports['default'] = LocalStorageAware;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

function LocalStorageAware(Collection) {

    return (function (_Collection) {
        function LocalStorageAwareCollection(options) {
            _classCallCheck(this, LocalStorageAwareCollection);

            options = _underscore2['default'].defaults(options || {}, {
                namespace: 'local',
                separator: ':'
            });

            _get(Object.getPrototypeOf(LocalStorageAwareCollection.prototype), 'constructor', this).call(this, options);

            this.namespace = options.namespace;
            this.separator = options.separator;
            this.bindLocalStorage();
        }

        _inherits(LocalStorageAwareCollection, _Collection);

        _createClass(LocalStorageAwareCollection, [{
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

                if (!_store2['default'].enabled) {
                    throw new Error('Local storage is not supported by your browser. ' + 'Please disable "Private Mode", or upgrade to a modern browser.');
                }

                var collection = this;
                collection.on('change', function (collection) {
                    _store2['default'].set(collection.addNamespaceToKey(collection.name), collection.data);
                });

                _store2['default'].forEach(function (collectionName, data) {
                    collectionName = store.removeNamespaceFromKey(collectionName);
                    if (collectionName && collectionName == collection.name) {
                        _underscore2['default'].each(data, function (doc) {
                            collection.insert(doc);
                        });
                    }
                });
            }
        }, {
            key: 'clear',
            value: function clear() {
                _get(Object.getPrototypeOf(LocalStorageAwareCollection.prototype), 'clear', this).call(this);
                LocalStore.clear();
            }
        }]);

        return LocalStorageAwareCollection;
    })(Collection);
}

module.exports = exports['default'];