#Immutable Store

#Collection

```js
import {Store, Model, Collection} from 'immutable-store';
class Comments extend Collection{
}

var comments = new Comments();
var comment = comments.insert({id: 1, likes: 4});

// immutable
var updatedComment = comments.update(1, {likes: 4});
console.log(comment === updatedComment) // logs true

updatedComment = comments.update(1, {likes: 5});
console.log(comment === updatedComment) // logs false

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
