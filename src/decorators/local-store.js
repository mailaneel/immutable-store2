import _ from 'underscore';
import localStorage from 'store';
import Collection from '../collection';
import Model from '../Model'


//TODO avoid repeating code

var getDecoratedCollection = function (_Collection) {
    return class LocalStorageAwareCollection extends _Collection {

        constructor(options) {
            options = _.defaults((options || {}), {
                namespace: 'local',
                separator: ':'
            });

            super(options);

            this.namespace = options.namespace;
            this.separator = options.separator;
            this.bindLocalStorage();
        }

        removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        }

        addNamespaceToKey(key) {
            return this.namespace + this.separator + key
        }

        bindLocalStorage() {

            if (!localStorage.enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' +
                        'Please disable "Private Mode", or upgrade to a modern browser.');
                }

                return;
            }

            var collection = this;
            collection.on('change', function (collection) {
                localStorage.set(collection.addNamespaceToKey(collection.name), collection.data);
            });

            localStorage.forEach(function (collectionName, data) {
                collectionName = collection.removeNamespaceFromKey(collectionName);
                if (collectionName && collectionName == collection.name) {
                    _.each(data, function (doc) {
                        collection.insert(doc);
                    });
                }
            });
        }

        clear() {
            super.clear();
            localStorage.clear();
        }
    }
};


var getDecoratedModel = function (_Model) {
    return class LocalStorageAwareModel extends _Model {

        constructor(options) {
            options = _.defaults((options || {}), {
                namespace: 'local',
                separator: ':'
            });

            super(options);

            this.namespace = options.namespace;
            this.separator = options.separator;
            this.bindLocalStorage();
        }

        removeNamespaceFromKey(fullKey) {
            var keyArray = fullKey.split(this.separator);
            if (keyArray.length == 2) {
                return keyArray[1];
            }
        }

        addNamespaceToKey(key) {
            return this.namespace + this.separator + key
        }

        bindLocalStorage() {

            if (!localStorage.enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' +
                        'Please disable "Private Mode", or upgrade to a modern browser.');
                }

                return;
            }

            var model = this;
            model.on('change', function (model) {
                localStorage.set(model.addNamespaceToKey(model.name), model.data);
            });

            localStorage.forEach(function (modelName, data) {
                modelName = model.removeNamespaceFromKey(modelName);
                if (modelName && modelName == model.name) {
                    model.set(data);
                }
            });
        }

        clear() {
            super.clear();
            localStorage.clear();
        }
    }
};

export default function LocalStorageAware(_Class) {
    if (_Class instanceof Collection) {
        return getDecoratedCollection(_Class);
    } else if (_Class instanceof Model) {
        return getDecoratedModel(_Class);
    }

    return _Class;
}

