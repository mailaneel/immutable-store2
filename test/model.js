var assert = require('chai').assert;
var Model = require('../lib/model');


describe('Model', function () {
    describe('#instance', function () {
        it('should create a instance with default options', function () {
            var model = new Model();
            assert.equal(model.idAttribute, 'id');
            assert.equal(model.cidAttribute, 'cid');
            assert.equal(model.cidPrefix, 'cid_');
            assert.isObject(model.data);
        });

        it('should override options if given', function () {
            var model = new Model('person', {idAttribute: '_id'});
            assert.equal(model.idAttribute, '_id');
            assert.equal(model.name, 'person');
        });
    });

    describe('#isCid', function () {
        it('should return true if given value is cid like', function () {
            var model = new Model();
            assert.isTrue(model.isCid('cid_1'));
            assert.isFalse(model.isCid(1));
        });
    });

    describe('#isId', function () {
        it('should return true if given value is id like', function () {
            var model = new Model();
            assert.isTrue(model.isId('1'));
            assert.isTrue(model.isId(1));
            assert.isFalse(model.isId('cid_1'));
        });
    });


    describe('#set', function () {
        it('should set by hash of key val', function () {
            var model = new Model('person');
            model.set({id: 1, name: 'a'});
            assert.equal(model.get('id'), 1);
            assert.equal(model.get('name'),'a');
        });

        it('should update value if key already exists', function () {
            var model = new Model('person');
            model.set({id: 1, name: 'a'});
            assert.equal(model.get('name'),'a');
            model.set({name: 'b'});
            assert.equal(model.get('name'),'b');
        });
    });

    describe('#get', function () {
        it('should return  value by key', function () {
            var model = new Model('person');
            model.set({id: 1, name: 'a'});
            assert.equal(model.get('name'), 'a');
        });
    });

    describe('#remove', function () {
        it('should remove by key', function () {
            var model = new Model('person');
            model.set({id: 1, name: 'a'});
            assert.equal(model.get('name'), 'a');
            model.remove('name');
            assert.isUndefined(model.get('name'));
        });
    });

    describe('#clear', function () {
        it('should clear model', function () {
            var model = new Model('person');
            model.set({id: 1, name: 'a'});
            assert.equal(model.get('name'), 'a');
            model.clear();
            assert.isUndefined(model.get('name'));
            assert.isUndefined(model.get('id'));
        });
    });

    describe('#event-change', function () {

        it('should trigger change event', function (done) {
            var model = new Model();

            model.on('change', function () {
                done();
            });

            model._triggerChange();
        });

    });
});