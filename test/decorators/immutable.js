var assert = require('chai').assert;
var Collection = require('../../lib/collection');

var Immutable = require('../../lib/decorators/immutable');

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