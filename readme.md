#Immutable Store

This branch is for updating store to immutable-js
please see tests for usage

#Collection

```
import {Collection} from 'immutable-store2';

var collection = new Collection();
collection.on('change', function(){
	//change event
});

//triggers change event
collection.add({id:1, comment: 'test comment', likes: 5});
collection.find(1); // returns Immutable.Map of object

//get likes 
collection.find(1).get('likes'); // returns 5

//update
// triggers change event
collection.update(1, {likes: 6});

// update with same data will not trigger change
collection.update(1, {likes: 6});

//get access to underlying data structure => Immutable.List and you call any functions available on this
collection.query(); // returns Immutable.List

//get state
collection.getState(); // returns Immutable.List 

//remove => will trigger change event
collection.remove(1); 

```

#Model

```
import {Model} from 'immutable-store2';

var model = new Model();
model.on('change', function(){
	//change event
});



```


#In Progress
