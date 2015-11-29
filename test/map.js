var assert = require('chai').assert;
var Map = require('../lib/map');
var Immutable = require('immutable');

var set = Map.set;
var setIn = Map.setIn;
var update = Map.update;
var updateIn = Map.updateIn;
var merge = Map.merge;

var testNestedData = {
    level1: {
        level2: {
            level3: {
                value: 1
            }
        }
    }
};

function getItem(alphabet) {
    return { id: alphabet, alphabet: alphabet };
}

//TODO refactor tests once api is stable

describe('Model', function () {


    describe('#set', function () {
        it('should set value by key', function () {
            var map = new Immutable.Map();
            map = set(map, 'id', 1);
            assert.equal(map.get('id'), 1);
            map = set(map, 'id', 2);
            assert.equal(map.get('id'), 2);
        });

        it('should convert value deeply to immutable', function () {
            var map = new Immutable.Map();
            map = set(map, 'a', { b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(map.getIn(['a', 'b', 'c', 'd']), 1);
        });
    });

    describe('#setIn', function () {
        it('should set nested value', function () {
            var map = merge(new Immutable.Map(), testNestedData);
            map = setIn(map, ['level1', 'level2', 'level3', 'value'], 2);
            assert.equal(map.getIn(['level1', 'level2', 'level3', 'value']), 2);
            assert.instanceOf(map.getIn(['level1', 'level2']), Immutable.Map)
        });

        it('should convert value deeply to immutable', function () {
            var map = new Immutable.Map();
            map = setIn(map, ['a'], { b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(map.getIn(['a', 'b', 'c', 'd']), 1);
        });
    });

    describe('#update', function () {
        it('should update value', function () {
            var map = merge(new Immutable.Map(), getItem('a'));
            assert.equal(map.get('alphabet'), 'a');
            map = update(map, 'alphabet', function (val) {
                return 'a-updated';
            });
            assert.equal(map.get('alphabet'), 'a-updated');
        });
    });

    describe('#updateIn', function () {
        it('should update nested value', function () {
            var map = merge(new Immutable.Map(), testNestedData);

            map = updateIn(map, ['level1', 'level2'], function (val) {
                // if return value is plain object it will be converted deep Immutable Map
                return { level3: 2 }
            });

            assert.instanceOf(map.getIn(['level1', 'level2']), Immutable.Map)
            assert.equal(map.getIn(['level1', 'level2', 'level3']), 2)

            map = updateIn(map, ['level1', 'level2'], function (val) {
                return val.set('level3', 3)
            });

            assert.instanceOf(map.getIn(['level1', 'level2']), Immutable.Map)
            assert.equal(map.getIn(['level1', 'level2', 'level3']), 3)
        });
    });


    describe("#merge", function () {
        it('should merge value deeply to immutable ', function () {
            var map = merge(new Immutable.Map(), {
                a: 1,
                b: {
                    c: 1
                }
            });
            assert.equal(map.getIn(['b', 'c']), 1);
            map = merge(map, { b: Immutable.Map({ c: 1 }) });
            assert.equal(map.getIn(['b', 'c']), 1);
        })
    });
});