import _ from 'underscore';
import Store from './store';
import localStorage from 'store';

export default class LocalStore extends Store {

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
        if(keyArray.length == 2){
            return keyArray[1];
        }
    }

    addNamespaceToKey(key) {
        return this.namespace + this.separator + key
    }

    bindLocalStorage() {

        if (!localStorage.enabled) {
            throw new Error('Local storage is not supported by your browser. ' +
                'Please disable "Private Mode", or upgrade to a modern browser.');
        }

        var store = this;
        store.on('change', function (store, collection) {
            // only store to local storage if useLocalStorage flag is set to true on collection
            if(collection.useLocalStorage){
                localStorage.set(store.addNamespaceToKey(collection.name), collection.data);
            }
        });

        localStorage.forEach(function (collectionName, data) {
            collectionName = store.removeNamespaceFromKey(collectionName);
            if (collectionName) {
                _.each(data, function (doc) {
                    store.collection(collectionName).insert(doc);
                });
            }
        });
    }

    clear(){
        LocalStore.clear();
    }

    static clear() {
        localStorage.clear();
    }
}