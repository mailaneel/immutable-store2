import _ from 'underscore';
import EventEmitter from 'eventemitter3';

export default class Store extends EventEmitter {

    constructor() {
        super();
        this.collections = {};
    }

    clear() {
        _.each(this.collections, function (collection) {
            collection.clear();
        });
    }

    collection(collectionName) {
        if (!collectionName || !this.collections[collectionName]) {
            throw new Error('collection does not exist');
        }

        return this.collections[collectionName];
    }

    registerCollection(collection) {
        this.collections[collection.name] = collection;
        this.bindEvents(collection);

        return collection;
    }

    bindEvents(collection) {
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
}


