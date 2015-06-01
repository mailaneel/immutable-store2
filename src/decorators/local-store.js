import _ from 'underscore';
import localStorage from 'store';

export default function LocalStorageAware(Collection) {

    return class LocalStorageAwareCollection extends Collection {

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
                collectionName = store.removeNamespaceFromKey(collectionName);
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
}

