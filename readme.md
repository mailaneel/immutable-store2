#Immutable Store
** Still under development **

Allows Immutable, Local Storage, Queryable Collections using decorators

```js
import {Collection, Immutable, Queryable, LocalStorageAware} from 'immutable-store';

@LocalStorageAware
@Queryable
@Immutable
// collection should be the first decorator for other decorators to work
@Collection
class Comments{
}

var comments = new Comments();
var comment = comments.insert({id: 1, likes: 4});

// immutable
var updatedComment = comments.update(1, {likes: 4});
console.log(comment === updatedComment) // logs true

updatedComment = comments.update(1, {likes: 5});
console.log(comment === updatedComment) // logs false


//queryable
comments.query({likes: {$gt:4}}); // returns [{id:1, likes:5, cid: 'cid_1'}]

// subscrube to this query
var unsubscribe = comments.subscribeToQuery({likes: {$gt:4}}, function(data){
   // collection will be queried and called with new data every time collection changes
   // when subscribed first time it will query existing data 
});

// when component is unmounted or not needed any more
unsubscribe();

//events
comments.on('change', function(collection){
// triggers for every update, insert, remove
});

```
