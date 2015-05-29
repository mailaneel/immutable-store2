var assert = require('chai').assert;
var Collection = require('../../lib/collection');

var Queryable = require('../../lib/decorators/queryable');

describe('QueryableCollection', function(){
    describe('#subscribeToQuery', function () {
        it('should execute query on change and call the callback with data', function (done) {

            var QueryableCollection = Queryable(Collection);
            var collection = new QueryableCollection('people');
            var isInitial = true;
            collection.subscribeToQuery({likes: {$gt: 3}}, function(data){
                if(data.length == 2 && !isInitial){
                    done();
                }else{
                    isInitial = false;
                }
            });

            collection.insert({likes: 5});
            collection.insert({likes: 4});
            collection.insert({likes: 3});
            collection.insert({likes: 2});
        });
    });
});