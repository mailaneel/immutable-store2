var assert = require('chai').assert;
var CollectionDecorator = require('../../lib/decorators/collection');
var Collection = require('../../lib/collection');

describe('CollectionDecorator', function () {
    it('should decorate collection', function () {
        function Comments(){}
        var comments = new (CollectionDecorator(Comments));
        assert.instanceOf(comments, Collection);
    });

});