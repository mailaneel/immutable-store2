import _ from 'underscore';
import Collection from './collection';
import EventEmitter from 'eventemitter3';

export default class Store extends EventEmitter {

    /**
     * @param options
     * @param {boolean} options.useLocalStorage
     * @param {*} options.collectionClass
     */
    constructor(options) {
        super();
        options = _.defaults((options || {}), {
            collectionClass: Collection
        });

        this.collectionClass = options.collectionClass;
        this.collections = {};

    }

    clear(){
        _.each(this.collections, function(collection){
           collection.clear();
        });
    }

    collection(collectionName) {
        if (!this.collections[collectionName]) {
            this.collections[collectionName.toLowerCase()] = this.createCollection(collectionName);
        }

        return this.collections[collectionName];
    }

    createCollection(collectionName, options) {
        var collection = new this.collectionClass(collectionName, options);

        // all collection events should be triggered on store as well
        // so any one listening on store should be able to get collection events
        var store = this;
        collection.on('change', function () {
            setTimeout(function(){
                store.emit('change', store, collection);
                store.emit(collection.name + ':' + 'change', store, collection);
                store.emit('change' + ':' + collection.name, store, collection);
            }, 0);
        });

        return collection;
    }
}


