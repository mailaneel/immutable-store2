var assert = require('chai').assert;
var ModelDecorator = require('../../lib/decorators/model');
var Model = require('../../lib/model');

describe('ModelDecorator', function () {
    it('should decorate model', function () {
        function Comment(){}
        var model = new (ModelDecorator(Comment));
        assert.instanceOf(model, Model);
    });

});