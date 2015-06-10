#Immutable Store

** under development **

Allows Immutable, Local Storage, Queryable Collections

#Collection

```js
import {Model, Collection, LocalStorageAware} from 'immutable-store';

@LocalStorageAware
class Comments extend Collection{
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

//events
comments.on('change', function(comments){
// triggers for every update, insert, remove
});

```

#Model

```js
class Comment extends Model{
}

var comment = new Comment();
comment.set({id:1, likes: 5});
comment.get('likes'); // returns 5
comment.remove('likes');
comment.clear();

comment.on('change', function(comment){

});

```
