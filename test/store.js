var assert = require('chai').assert;
var Store = require('../lib/store');
var Collection = require('../lib/collection');


describe('Store', function () {
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var store = new Store();
            assert.instanceOf(store.collections, Object);
        });

    });

    describe('#createCollection', function () {
        it('should create collection with given options', function () {
            var store = new Store();
            var collection = store.registerCollection(new Collection('people'));
            assert.instanceOf(store.collections['people'], Collection);
            assert.equal(store.collections['people'], collection);

        });

    });

    describe('#collection', function () {
        it('should return collection instance and if collection does not exist create and return', function () {
            var store = new Store();
            assert.throws(store.collection, Error);
        });
    });

    describe('#event-change', function(){

        it('should trigger change event using change event', function(done){
            var store = new Store();
            var collection = store.registerCollection(new Collection('people'));
            store.on('change', function(){
                done();
            });
            collection._triggerChange();
        });

        it('should trigger change event using change:collectionName event', function(done){
            var store = new Store();
            var collection = store.registerCollection(new Collection('people'));
            store.on('change:people', function(){
                done();
            });

            collection._triggerChange();
        });

    });
});
