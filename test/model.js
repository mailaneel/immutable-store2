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
            var model = new Model({ id: 1, name: 'a' });
            assert.equal(model.get('id'), 1);
        });
    });


    describe('#set', function () {
        it('should set val by key', function () {
            var model = new Model();
            model.set('id', 1);
            assert.equal(model.get('id'), 1);
        });

        it('should update value if key already exists', function () {
            var model = new Model({ id: 1, name: 'a' });
            assert.equal(model.get('name'), 'a');
            model.set('name', 'b');
            assert.equal(model.get('name'), 'b');
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
            model.set('name', 'a');
            assert.equal(model.get('name'), 'a');
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
            model.set('name', 'a');
            assert.equal(model.get('name'), 'a');
            model.remove('name');
            assert.isUndefined(model.get('name'));
        });
    });

    describe('#clear', function () {
        it('should clear model', function () {
            var model = new Model({ id: 1, name: 'a' });
            assert.equal(model.get('name'), 'a');
            model.clear();
            assert.isUndefined(model.get('name'));
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
            model.set('name', 'a');      
        });

        it('should trigger change event only if there is a real change in data', function (done) {
            var model = new Model();
            model.on('change', done);
            model.set('name', 'a');
            
            //change will be triggered once because there is no real change
            model.set('name', 'a');
        });
    });
});