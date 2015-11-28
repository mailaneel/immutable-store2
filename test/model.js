var assert = require('chai').assert;
var Model = require('../lib/model');
var Immutable = require('immutable');

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
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var model = new Model();
            assert.equal(model.idAttribute, 'id');
            assert.equal(model.cidAttribute, 'cid');
            assert.equal(model.cidPrefix, 'cid_');
            assert.equal(model._bufferTime, 0);
            assert.isObject(model.state);
            assert.instanceOf(model.state, Immutable.Map);
        });

        it('should override options if given', function () {
            var model = new Model(null, { idAttribute: '_id' });
            assert.equal(model.idAttribute, '_id');
        });

        it('should create model with initial data if given', function () {
            var model = new Model(getItem('a'));
            assert.equal(model.get('id'), 'a');
        });
    });


    describe('#set', function () {
        it('should set value by key', function () {
            var model = new Model();
            model.set('id', 1);
            assert.equal(model.get('id'), 1);
            model.set('id', 2);
            assert.equal(model.get('id'), 2);
        });

        it('should convert value deeply to immutable', function () {
            var model = new Model();
            model.set('a', { b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(model.getIn(['a', 'b', 'c', 'd']), 1);
        });
    });

    describe('#setIn', function () {
        it('should set nested value', function () {
            var model = new Model(testNestedData);
            model.setIn(['level1', 'level2', 'level3', 'value'], 2);
            assert.equal(model.getIn(['level1', 'level2', 'level3', 'value']), 2);
            assert.instanceOf(model.getIn(['level1', 'level2']), Immutable.Map)
        });

        it('should convert value deeply to immutable', function () {
            var model = new Model();
            model.setIn(['a'], { b: { c: Immutable.Map({ d: 1 }) } });
            assert.equal(model.getIn(['a', 'b', 'c', 'd']), 1);
        });
    });

    describe('#update', function () {
        it('should update value', function () {
            var model = new Model(getItem('a'));
            assert.equal(model.get('alphabet'), 'a');
            model.update('alphabet', function (val) {
                return 'a-updated';
            });
            assert.equal(model.get('alphabet'), 'a-updated');
        });

        it('should not update state if there is no change', function () {
            var model = new Model(getItem('a'));
            assert.equal(model.get('alphabet'), 'a');
            var state = model.getState();
            model.update('alphabet', function (val) {
                return 'a';
            });
            assert.equal(model.get('alphabet'), 'a');
            assert.deepEqual(state, model.getState());
        });
    });

    describe('#updateIn', function () {
        it('should update nested value', function () {
            var model = new Model(testNestedData);

            model.updateIn(['level1', 'level2'], function (val) {
                // if return value is plain object it will be converted deep Immutable Map
                return { level3: 2 }
            });

            assert.instanceOf(model.getIn(['level1', 'level2']), Immutable.Map)
            assert.equal(model.getIn(['level1', 'level2', 'level3']), 2)

            model.updateIn(['level1', 'level2'], function (val) {
                return val.set('level3', 3)
            });

            assert.instanceOf(model.getIn(['level1', 'level2']), Immutable.Map)
            assert.equal(model.getIn(['level1', 'level2', 'level3']), 3)
        });
    });

    describe('#get', function () {
        it('should get value by key', function () {
            var model = new Model();
            model.set('alphabet', 'a');
            assert.equal(model.get('alphabet'), 'a');
        });
    });

    describe('#getIn', function () {
        it('should get nested value', function () {
            var model = new Model(testNestedData);
            assert.equal(model.getIn(['level1', 'level2', 'level3', 'value']), 1);
        });
    });

    describe('#remove', function () {
        it('should remove by key', function () {
            var model = new Model();
            model.set('alphabet', 'a');
            assert.equal(model.get('alphabet'), 'a');
            model.remove('alphabet');
            assert.isUndefined(model.get('alphabet'));
        });
    });

    describe('#clear', function () {
        it('should clear model', function () {
            var model = new Model(getItem('a'));
            assert.equal(model.get('alphabet'), 'a');
            model.clear();
            assert.isUndefined(model.get('alphabet'));
            assert.isUndefined(model.get('id'));
        });
    });

    describe('#getState', function () {
        it('should get underlying data structure for advanced querying and filtering', function () {
            var model = new Model();
            assert.instanceOf(model.getState(), Immutable.Map);
        })
    });

    describe('#event-change', function () {
        it('should trigger change event', function (done) {
            var model = new Model();
            model.on('change', done);
            model.set('alphabet', 'a');
        });

        it('should trigger change event only if there is a real change in data', function (done) {
            var model = new Model();
            model.on('change', done);
            model.set('alphabet', 'a');
            
            //change will be triggered once because there is no real change
            model.set('alphabet', 'a');
        });

        it('should trigger change event only once i.e use buffering', function (done) {
            var model = new Model();

            model.on('change', function () {
                done();
            });

            // all events are buffered for 1ms and and then triggered
            // so done should only be called once
            model.emitChange();
            model.emitChange();
        });
    });


    describe("#usecases", function () {
        it('should convert value deeply to immutable ', function () {
            var model = new Model({
                a: 1,
                b: {
                    c: 1
                }
            });
            assert.equal(model.getIn(['b', 'c']), 1);

            var oldState = model.getState();
            model.merge({ b: Immutable.Map({ c: 1 }) });
            assert.equal(model.getIn(['b', 'c']), 1);
            assert.deepEqual(oldState, model.getState())
        })
    });
});