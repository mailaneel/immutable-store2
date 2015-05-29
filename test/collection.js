var assert = require('chai').assert;
var Collection = require('../lib/collection');

var Immutable = require('../lib/decorators/immutable');
var Queryable = require('../lib/decorators/queryable');


describe('Collection', function () {
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var collection = new Collection();
            assert.equal(collection.idAttribute, 'id');
            assert.equal(collection.cidAttribute, 'cid');
            assert.equal(collection.cidPrefix, 'cid_');
            assert.isArray(collection.data);
            assert.equal(collection.data.length, 0);
            assert.deepEqual(collection.indexKeys, ['id', 'cid']);
            assert.isObject(collection.indexes);
        });

        it('should override options if given', function () {
            var collection = new Collection('people', {idAttribute: '_id'});
            assert.equal(collection.idAttribute, '_id');
            assert.equal(collection.name, 'people');
        });
    });

    describe('#isCid', function () {
        it('should return true if given value is cid like', function () {
            var collection = new Collection();
            assert.isTrue(collection.isCid('cid_1'));
            assert.isFalse(collection.isCid(1));
        });
    });

    describe('#isId', function () {
        it('should return true if given value is id like', function () {
            var collection = new Collection();
            assert.isTrue(collection.isId('1'));
            assert.isTrue(collection.isId(1));
            assert.isFalse(collection.isId('cid_1'));
        });
    });

    describe('#get', function () {
        it('should return doc by id, cid, doc', function () {
            var collection = new Collection('people');
            collection.insert({id: 1, name: 'a'});
            assert.equal(collection.get(1).name, 'a');
            assert.equal(collection.get({id: 1}).name, 'a');
            assert.isFalse(collection.get({}));
        });
    });

    describe('#insert', function () {
        it('should insert object', function () {
            var collection = new Collection('people');
            collection.insert({id: 1, name: 'a'});
            assert.equal(collection.count(), 1);
        });

        it('should update object if it already exists', function () {
            var collection = new Collection('people');
            collection.insert({id: 1, name: 'a'});
            assert.equal(collection.count(), 1);
            collection.insert({id: 1, name: 'b'});
            assert.equal(collection.count(), 1);
            assert.equal(collection.get(1).name, 'b');
        });
    });

    describe('#update', function () {
        it('should update object by id or cid', function () {
            var collection = new Collection('people');
            collection.insert({id: 1, name: 'a'});
            assert.equal(collection.count(), 1);
            collection.update({id: 1, name: 'b'});
            assert.equal(collection.count(), 1);
            assert.equal(collection.get(1).name, 'b');

            collection.update(1, {name: 'c'});
            assert.equal(collection.count(), 1);
            assert.equal(collection.get(1).name, 'c');
        });
    });

    describe('#remove', function () {
        it('should remove object by id or cid or object', function () {
            var collection = new Collection('people');
            collection.insert({id: 1, name: 'a'});
            collection.insert({id: 2, name: 'b'});
            collection.insert({id: 3, name: 'c'});
            assert.equal(collection.count(), 3);

            collection.remove(1);
            assert.equal(collection.count(), 2);

            collection.remove(collection.get(2));
            assert.equal(collection.count(), 1);

            collection.remove(collection.get(3).cid);
            assert.equal(collection.count(), 0);
        });
    });

    describe('#event-change', function () {

        it('should trigger change event', function (done) {
            var collection = new Collection();

            collection.on('change', function () {
                done();
            });

            // all events are buffered for 1ms and and then triggered
            // so done should only be called once
            collection._triggerChange();
            collection._triggerChange();
        });

    });
});

describe('ImmutableCollection', function(){
    describe('#update', function () {
        it('should update object by id or cid', function () {

            var ImmutableCollection = Immutable(Collection);

            var collection = new ImmutableCollection('people');
            collection.insert({id: 1, name: 'a'});
            assert.equal(collection.count(), 1);
            collection.update({id: 1, name: 'b'});
            assert.equal(collection.count(), 1);
            assert.equal(collection.get(1).name, 'b');

            collection.update(1, {name: 'c'});
            assert.equal(collection.count(), 1);
            assert.equal(collection.get(1).name, 'c');

            // if obj is not updated it should return same immutable obj
            var previousObj = collection.get(1);
            collection.update(1, {name: 'c'});
            assert.equal(previousObj, collection.get(1));

            // if obj is changed it should return new obj
            collection.update(1, {name: 'd'});
            assert.notEqual(previousObj, collection.get(1));
        });
    });
});

describe('QueryableCollection', function(){
    describe('#subscribeToQuery', function () {
        it('should execute query on change and call the callback with data', function (done) {

            var QueryableCollection = Queryable(Collection);
            var collection = new QueryableCollection('people');
            var isInitial = true;
            collection.subscribeToQuery({likes: {$gt: 3}}, function(data){
                if(data.length == 2 && !isInitial){
                    done();
                }else{
                    isInitial = false;
                }
            });

            collection.insert({likes: 5});
            collection.insert({likes: 4});
            collection.insert({likes: 3});
            collection.insert({likes: 2});
        });
    });
});