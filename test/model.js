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

function getItem(alphabet){
    return {id: alphabet, alphabet: alphabet};
}

describe('Model', function () {
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var model = new Model();
            assert.equal(model.idAttribute, 'id');
            assert.equal(model.cidAttribute, 'cid');
            assert.equal(model.cidPrefix, 'cid_');
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
        it('should set val by key', function () {
            var model = new Model();
            model.set('id', 1);
            assert.equal(model.get('id'), 1);
        });

        it('should update value if key already exists', function () {
            var model = new Model(getItem('a'));
            assert.equal(model.get('alphabet'), 'a');
            model.set('alphabet', 'a-updated');
            assert.equal(model.get('alphabet'), 'a-updated');
        });
    });

    describe('#setIn', function () {
        it('should set nested value', function () {
            var model = new Model(testNestedData);
            model.setIn(['level1', 'level2', 'level3', 'value'], 2);
            assert.equal(model.getIn(['level1', 'level2', 'level3', 'value']), 2);
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
    
    describe('#query', function(){
       it('should export underlying data structure for advanced querying and filtering', function(){
           var model = new Model();
           assert.instanceOf(model.query(), Immutable.Map);
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
});