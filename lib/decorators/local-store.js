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

var getDecoratedClass = function getDecoratedClass(_Class) {
    return (function (_Class2) {
        function LocalStorageAwareClass(options) {
            _classCallCheck(this, LocalStorageAwareClass);

            options = _underscore2['default'].defaults(options || {}, {
                namespace: 'local',
                separator: ':',
                storage: _store2['default']
            });

            _Class2.call(this, options);

            this.namespace = options.namespace;
            this.separator = options.separator;

            this.storage = options.storage;

            if (!this.storage.enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' + 'Please disable "Private Mode", or upgrade to a modern browser.');
                }
            } else {
                this.bindLocalStorage();
            }
        }

        _inherits(LocalStorageAwareClass, _Class2);

        LocalStorageAwareClass.prototype.removeNamespaceFromKey = function removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        };

        LocalStorageAwareClass.prototype.addNamespaceToKey = function addNamespaceToKey(key) {
            return this.namespace + this.separator + key;
        };

        LocalStorageAwareClass.prototype.bindLocalStorage = function bindLocalStorage() {
            throw new Error('Extending class must implement me');
        };

        LocalStorageAwareClass.prototype.clear = function clear() {
            _Class2.prototype.clear.call(this);
            this.storage.clear();
        };

        return LocalStorageAwareClass;
    })(_Class);
};

var getDecoratedCollection = function getDecoratedCollection(_Collection) {
    _Collection = getDecoratedClass(_Collection);
    return (function (_Collection2) {
        function LocalStorageAwareCollection() {
            _classCallCheck(this, LocalStorageAwareCollection);

            if (_Collection2 != null) {
                _Collection2.apply(this, arguments);
            }
        }

        _inherits(LocalStorageAwareCollection, _Collection2);

        LocalStorageAwareCollection.prototype.bindLocalStorage = function bindLocalStorage() {
            var collection = this;
            collection.on('change', function (collection) {
                collection.storage.set(collection.addNamespaceToKey(collection.name), collection.data);
            });

            this.storage.forEach(function (collectionName, data) {
                collectionName = collection.removeNamespaceFromKey(collectionName);
                if (collectionName && collectionName == collection.name) {
                    _underscore2['default'].each(data, function (doc) {
                        collection.insert(doc);
                    });
                }
            });
        };

        return LocalStorageAwareCollection;
    })(_Collection);
};

var getDecoratedModel = function getDecoratedModel(_Model) {
    _Model = getDecoratedClass(_Model);
    return (function (_Model2) {
        function LocalStorageAwareModel() {
            _classCallCheck(this, LocalStorageAwareModel);

            if (_Model2 != null) {
                _Model2.apply(this, arguments);
            }
        }

        _inherits(LocalStorageAwareModel, _Model2);

        LocalStorageAwareModel.prototype.bindLocalStorage = function bindLocalStorage() {
            var model = this;
            model.on('change', function (model) {
                model.storage.set(model.addNamespaceToKey(model.name), model.data);
            });

            this.storage.forEach(function (modelName, data) {
                modelName = model.removeNamespaceFromKey(modelName);
                if (modelName && modelName == model.name) {
                    model.set(data);
                }
            });
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