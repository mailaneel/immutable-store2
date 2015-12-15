var assert = require('chai').assert;
var List = require('../lib/list');
var Immutable = require('immutable');

var add = List.add;
var update = List.update;
var remove = List.remove;
var find = List.find;
var findIndex = List.findIndex;
var has = List.has;


function getItem(alphabet) {
    return { id: alphabet, alphabet: alphabet };
}

//TODO refactor tests once api is stable
describe('Collection', function () {

    describe('#find', function () {
        it('should return doc by id, cid, doc', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.equal(find(list, 'a').get('alphabet'), 'a');
            assert.equal(find(list, { id: 'a' }).get('alphabet'), 'a');
            assert.isUndefined(find(list, {}));
            assert.isUndefined(find(list));
            assert.isUndefined(find(list, 0));
        });
    });

    describe('#findIndex', function () {
        it('should return index of item by id, cid, doc', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.equal(findIndex(list, 'a'), 0);
            assert.equal(findIndex(list, { id: 'a' }), 0);
            assert.equal(findIndex(list, {}), -1);
            assert.equal(findIndex(list), -1);
            assert.equal(findIndex(list, 0), -1);
        });
    });

    describe('#has', function () {
        it('should return true if item exists by id, cid, object', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.isTrue(has(list, 'a'));
            assert.isTrue(has(list, { id: 'a' }));
            assert.isFalse(has(list, {}));
            assert.isFalse(has(list));
            assert.isFalse(has(list, 0));
        });
    });

    describe('#add', function () {
        it('should add object', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.instanceOf(find(list, 'a'), Immutable.Map);
            assert.equal(list.size, 1);
        });
        
        it('should not add if object is null or undefined', function () {
            var list = new Immutable.List();
            list = add(list, null);
            assert.equal(list.size, 0);
        });

        it('should update object if it already exists', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.equal(list.size, 1);
            list = add(list, { id: 'a', alphabet: 'a-updated' });
            assert.equal(list.size, 1);
            assert.equal(find(list, 'a').get('alphabet'), 'a-updated');
        });

        it('should be able to add array of items', function () {
            var list = new Immutable.List();
            list = add(list, [getItem('a'), getItem('b'), getItem('a')]);
            
            // it should update 3rd item instead of adding so we should have only 2 items in collection
            assert.equal(list.size, 2);
        });

        it('should be able to add nested object', function () {
            var list = new Immutable.List();
            list = add(list, { id: 1, a: 1, b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(list.size, 1);
            assert.equal(find(list, 1).getIn(['b', 'c', 'd']), 1);
        });
    });

    describe('#update', function () {
        it('should update object by id or cid', function () {
            var list = new Immutable.List();
            list = add(list, getItem('a'));
            assert.equal(list.size, 1);
            list = update(list, 'a', { alphabet: 'a-updated' });
            assert.equal(list.size, 1);
            assert.equal(find(list, 'a').get('alphabet'), 'a-updated');
        });

        it('should update list of objects', function () {
            var list = add(new Immutable.List(), [getItem('a'), getItem('b')]);
            assert.equal(list.size, 2);
            list = update(list, [{ id: 'a', alphabet: 'a-updated' }, { id: 'b', alphabet: 'b-updated' }]);
            assert.equal(list.size, 2);
            assert.equal(find(list, 'a').get('alphabet'), 'a-updated');
            assert.equal(find(list, 'b').get('alphabet'), 'b-updated');
        });

        it('should be able to update nested object', function () {
            var list = new Immutable.List();
            list = add(list, { id: 1, a: 1, b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(list.size, 1);
            assert.equal(find(list, 1).getIn(['b', 'c', 'd']), 1);
            list = update(list, 1, { b: { c: { d: 2 } } });
            assert.equal(find(list, 1).getIn(['b', 'c', 'd']), 2);
        });

    });

    describe('#remove', function () {
        it('should remove object by id or cid or object', function () {
            var list = add(new Immutable.List(), [getItem('a'), getItem('b'), getItem('c')]);
            assert.equal(list.size, 3);

            list = remove(list, 'a');
            assert.equal(list.size, 2);

            list = remove(list, find(list, 'b'));
            assert.equal(list.size, 1);

            list = remove(list, find(list, 'c').get('cid'));
            assert.equal(list.size, 0);
        });
    });
});