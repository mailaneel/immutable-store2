var assert = require('chai').assert;
var Collection = require('../lib/collection');
var Immutable = require('immutable');

describe('Collection', function () {
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var collection = new Collection();
            assert.equal(collection.idAttribute, 'id');
            assert.equal(collection.cidAttribute, 'cid');
            assert.equal(collection.cidPrefix, 'cid_');
            assert.instanceOf(collection.state, Immutable.List);
            assert.equal(collection.size, 0);
        });

        it('should override options if given', function () {
            var collection = new Collection([], { idAttribute: '_id' });
            assert.equal(collection.idAttribute, '_id');
        });

        it('should create collection with initial data if given', function () {
            var collection = new Collection([{ id: 1, name: 'a' }]);
            assert.equal(collection.size, 1);
        });

    });

    describe('#find', function () {
        it('should return doc by id, cid, doc', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            assert.equal(collection.find(1).get('name'), 'a');
            assert.equal(collection.find({ id: 1 }).get('name'), 'a');
            // assert.isFalse(collection.find({}));
        });
    });

    describe('#add', function () {
        it('should add object', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            assert.instanceOf(collection.find(1), Immutable.Map);
            assert.equal(collection.size, 1);
        });

        it('should update object if it already exists', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            assert.equal(collection.size, 1);
            collection.add({ id: 1, name: 'b' });
            assert.equal(collection.size, 1);
            assert.equal(collection.find(1).get('name'), 'b');
        });
    });

    describe('#update', function () {
        it('should update object by id or cid', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            assert.equal(collection.size, 1);
            collection.update(1, { id: 1, name: 'b' });
            assert.equal(collection.size, 1);
            assert.equal(collection.find(1).get('name'), 'b');

            collection.update(1, { name: 'c' });
            assert.equal(collection.size, 1);
            assert.equal(collection.find(1).get('name'), 'c');
        });
    });

    describe('#remove', function () {
        it('should remove object by id or cid or object', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            collection.add({ id: 2, name: 'b' });
            collection.add({ id: 3, name: 'c' });
            assert.equal(collection.size, 3);

            collection.remove(1);
            assert.equal(collection.size, 2);

            collection.remove(collection.find(2));
            assert.equal(collection.size, 1);

            collection.remove(collection.find(3).get('cid'));
            assert.equal(collection.size, 0);
        });
    });

    describe('#event-change', function () {
        it('should trigger change event', function (done) {
            var collection = new Collection();

            collection.on('change', function () {
                done();
            });

            collection.add({ id: 1 });
        });

        it('should trigger change event only if there is a real change in data', function (done) {
            var collection = new Collection();

            collection.on('change', function () {
                done();
            });

            collection.add({ id: 1, name: 'a' });
            collection.update(1, {name: 'a'})
        });

    });

    describe('#clear', function () {
        it('should clear collection', function () {
            var collection = new Collection();
            collection.add({ id: 1, name: 'a' });
            assert.equal(collection.size, 1);
            collection.clear();
            assert.equal(collection.size, 0);
        });
    });
});