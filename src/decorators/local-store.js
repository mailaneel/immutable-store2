import _ from 'underscore';
import localStorage from 'store';
import Collection from '../collection';
import Model from '../model'


//TODO avoid repeating code

var getDecoratedClass = function(_Class){
    return class LocalStorageAwareClass extends _Class {

        constructor(options) {
            options = _.defaults((options || {}), {
                namespace: 'local',
                separator: ':',
                storage: localStorage
            });

            super(options);

            this.namespace = options.namespace;
            this.separator = options.separator;

            this.storage = options.storage;

            if (!this.storage.enabled) {
                if (console && console.log) {
                    console.log('Local storage is not supported by your browser. ' +
                        'Please disable "Private Mode", or upgrade to a modern browser.');
                }
            }else{
                this.bindLocalStorage();
            }
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
            throw new Error('Extending class must implement me');
        }

        clear() {
            super.clear();
            this.storage.clear();
        }
    }
};


var getDecoratedCollection = function (_Collection) {
    _Collection = getDecoratedClass(_Collection);
    return class LocalStorageAwareCollection extends _Collection {
        bindLocalStorage() {
            var collection = this;
            collection.on('change', function (collection) {
                collection.storage.set(collection.addNamespaceToKey(collection.name), collection.data);
            });

            this.storage.forEach(function (collectionName, data) {
                collectionName = collection.removeNamespaceFromKey(collectionName);
                if (collectionName && collectionName == collection.name) {
                    _.each(data, function (doc) {
                        collection.insert(doc);
                    });
                }
            });
        }
    }
};


var getDecoratedModel = function (_Model) {
    _Model = getDecoratedClass(_Model);
    return class LocalStorageAwareModel extends _Model {
        bindLocalStorage() {
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

