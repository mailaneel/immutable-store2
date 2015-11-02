import defaults from 'lodash.defaults';
import Immutable from 'immutable';
import uniqueId from 'lodash.uniqueid';
import isObject from 'lodash.isobject';
import Store from './store';

class Collection extends Store {
    constructor(state, options) {
        super(state, options = defaults((options || {}), {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            type: 'collection'
        }));
    }

    _prepareItem(item) {
        return defaults((item || {}), {
            [this.cidAttribute]: uniqueId(this.cidPrefix),
        });
    }

    _getItemId(item) {
        if (item instanceof Immutable.Map) {
            return item.get(this.idAttribute) || item.get(this.cidAttribute);
        }

        if (isObject(item)) {
            return item.id | item.cid;
        }

        return item;
    }

    add(item) {        
        if (this.has(item)) {
            return this.update(this._getItemId(item), item);
        }
        

        item = this._prepareItem(item);
        this.setState(this.state.push(Immutable.Map(item)));
        return this;
    }
   

    update(id, item) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this.add(item);
        }

        let newState = this.state.update(index, (existingItem) => {
            return existingItem.mergeDeep(item);
        });
        
        this.setState(newState);
        return this;
    }

    remove(id) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this;
        }

        this.setState(this.state.remove(index));
    }

    clear() {
        this.setState(this.state.clear());
    }

    has(id) {
        return !!(this.find(id))
    }

    get size() {
        return this.state.size;
    }

}

//finders
['find', 'findIndex'].forEach((method) => {
    Collection.prototype[method] = function (id) {
        id = this._getItemId(id);
        return this.state[method]((item) => {
            return (item.get(this.idAttribute) === id || item.get(this.cidAttribute) === id);
        })
    }
});

['includes', 'contains', 'indexOf', 'toJS', 'toJSON', 'toArray', 'toObject'].forEach((method) => {
    Collection.prototype[method] = function (...rest) {
        return this.state[method].apply(this.state, rest);
    }
});

export default Collection;
