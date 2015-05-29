var assert = require('chai').assert;
var CollectionDecorator = require('../../lib/decorators/collection');
var Collection = require('../../lib/collection');

describe('CollectionDecorator', function () {
    it('should decorate collection', function () {

        var comments = new (CollectionDecorator(function(){}));
        assert.instanceOf(comments, Collection);
    });

});