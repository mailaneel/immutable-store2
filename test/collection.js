var assert = require('chai').assert;
var Collection = require('../lib/collection');
var Immutable = require('immutable');

function getItem(alphabet) {
    return { id: alphabet, alphabet: alphabet };
}

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
            var collection = new Collection([getItem('a')]);
            assert.equal(collection.size, 1);
        });

    });

    describe('#find', function () {
        it('should return doc by id, cid, doc', function () {
            var collection = new Collection();
            collection.add(getItem('a'));
            assert.equal(collection.find('a').get('alphabet'), 'a');
            assert.equal(collection.find({ id: 'a' }).get('alphabet'), 'a');
            assert.isUndefined(collection.find({}));
            assert.isUndefined(collection.find());
            assert.isUndefined(collection.find(0));
        });
    });

    describe('#add', function () {
        it('should add object', function () {
            var collection = new Collection();
            collection.add(getItem('a'));
            assert.instanceOf(collection.find('a'), Immutable.Map);
            assert.equal(collection.size, 1);
        });

        it('should update object if it already exists', function () {
            var collection = new Collection();
            collection.add(getItem('a'));
            assert.equal(collection.size, 1);
            collection.add({ id: 'a', alphabet: 'a-updated' });
            assert.equal(collection.size, 1);
            assert.equal(collection.find('a').get('alphabet'), 'a-updated');
        });

        it('should be able to add array of items', function () {
            var collection = new Collection();
            collection.add([getItem('a'), getItem('b'), getItem('a')]);
            
            // it should update 3rd item instead of adding so we should have only 2 items in collection
            assert.equal(collection.size, 2);
        });
    });

    describe('#update', function () {
        it('should update object by id or cid', function () {
            var collection = new Collection();
            collection.add(getItem('a'));
            assert.equal(collection.size, 1);
            collection.update('a', { alphabet: 'a-updated' });
            assert.equal(collection.size, 1);
            assert.equal(collection.find('a').get('alphabet'), 'a-updated');
        });

        it('should update list of objects', function () {
            var collection = new Collection([getItem('a'), getItem('b')]);
            assert.equal(collection.size, 2);
            collection.update([{ id: 'a', alphabet: 'a-updated' }, { id: 'b', alphabet: 'b-updated' }]);
            assert.equal(collection.size, 2);
            assert.equal(collection.find('a').get('alphabet'), 'a-updated');
            assert.equal(collection.find('b').get('alphabet'), 'b-updated');
        })

    });

    describe('#remove', function () {
        it('should remove object by id or cid or object', function () {
            var collection = new Collection([getItem('a'), getItem('b'), getItem('c')]);
            assert.equal(collection.size, 3);

            collection.remove('a');
            assert.equal(collection.size, 2);

            collection.remove(collection.find('b'));
            assert.equal(collection.size, 1);

            collection.remove(collection.find('c').get('cid'));
            assert.equal(collection.size, 0);
        });
    });

    describe('#event-change', function () {
        it('should trigger change event', function (done) {
            var collection = new Collection();

            collection.on('change', function () {
                done();
            });

            collection.add(getItem('a'));
        });

        it('should trigger change event only if there is a real change in data', function (done) {
            var collection = new Collection();

            collection.on('change', done);

            collection.add(getItem('a'));
            collection.update(1, { alphabet: 'a' })
        });

        it('should trigger change event only once i.e use buffering', function (done) {
            var collection = new Collection();

            collection.on('change', done);

            // all events are buffered for 1ms and and then triggered
            // so done should only be called once
            collection.add([getItem('a'), getItem('b')]);
            collection.add(getItem('c'));
        });

    });

    describe('#query', function () {
        it('should export underlying data structure for advanced querying and filtering', function () {
            var collection = new Collection();
            assert.instanceOf(collection.query(), Immutable.List);
        })
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