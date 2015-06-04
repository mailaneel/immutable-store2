'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = LocalStorageAware;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

var _Model3 = require('../Model');

var _Model4 = _interopRequireDefault(_Model3);

//TODO avoid repeating code

var getDecoratedCollection = function getDecoratedCollection(_Collection) {
    return (function (_Collection2) {
        function LocalStorageAwareCollection(options) {
            _classCallCheck(this, LocalStorageAwareCollection);

            options = _underscore2['default'].defaults(options || {}, {
                namespace: 'local',
                separator: ':'
            });

            _Collection2.call(this, options);

            this.namespace = options.namespace;
            this.separator = options.separator;
            this.bindLocalStorage();
        }

        _inherits(LocalStorageAwareCollection, _Collection2);

        LocalStorageAwareCollection.prototype.removeNamespaceFromKey = function removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        };

        LocalStorageAwareCollection.prototype.addNamespaceToKey = function addNamespaceToKey(key) {
            return this.namespace + this.separator + key;
        };

        LocalStorageAwareCollection.prototype.bindLocalStorage = function bindLocalStorage() {

            if (!_store2['default'].enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' + 'Please disable "Private Mode", or upgrade to a modern browser.');
                }

                return;
            }

            var collection = this;
            collection.on('change', function (collection) {
                _store2['default'].set(collection.addNamespaceToKey(collection.name), collection.data);
            });

            _store2['default'].forEach(function (collectionName, data) {
                collectionName = collection.removeNamespaceFromKey(collectionName);
                if (collectionName && collectionName == collection.name) {
                    _underscore2['default'].each(data, function (doc) {
                        collection.insert(doc);
                    });
                }
            });
        };

        LocalStorageAwareCollection.prototype.clear = function clear() {
            _Collection2.prototype.clear.call(this);
            _store2['default'].clear();
        };

        return LocalStorageAwareCollection;
    })(_Collection);
};

var getDecoratedModel = function getDecoratedModel(_Model) {
    return (function (_Model2) {
        function LocalStorageAwareModel(options) {
            _classCallCheck(this, LocalStorageAwareModel);

            options = _underscore2['default'].defaults(options || {}, {
                namespace: 'local',
                separator: ':'
            });

            _Model2.call(this, options);

            this.namespace = options.namespace;
            this.separator = options.separator;
            this.bindLocalStorage();
        }

        _inherits(LocalStorageAwareModel, _Model2);

        LocalStorageAwareModel.prototype.removeNamespaceFromKey = function removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        };

        LocalStorageAwareModel.prototype.addNamespaceToKey = function addNamespaceToKey(key) {
            return this.namespace + this.separator + key;
        };

        LocalStorageAwareModel.prototype.bindLocalStorage = function bindLocalStorage() {

            if (!_store2['default'].enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' + 'Please disable "Private Mode", or upgrade to a modern browser.');
                }

                return;
            }

            var model = this;
            model.on('change', function (model) {
                _store2['default'].set(model.addNamespaceToKey(model.name), model.data);
            });

            _store2['default'].forEach(function (modelName, data) {
                modelName = model.removeNamespaceFromKey(modelName);
                if (modelName && modelName == model.name) {
                    model.set(data);
                }
            });
        };

        LocalStorageAwareModel.prototype.clear = function clear() {
            _Model2.prototype.clear.call(this);
            _store2['default'].clear();
        };

        return LocalStorageAwareModel;
    })(_Model);
};

function LocalStorageAware(_Class) {
    if (_Class instanceof _collection2['default']) {
        return getDecoratedCollection(_Class);
    } else if (_Class instanceof _Model4['default']) {
        return getDecoratedModel(_Class);
    }

    return _Class;
}

module.exports = exports['default'];