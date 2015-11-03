import defaults from 'lodash.defaults';
import Immutable from 'immutable';
import uniqueId from 'lodash.uniqueid';
import isObject from 'lodash.isobject';
import Store from './store';


class Collection extends Store {
    constructor(state, options) {
        super(state, Object.assign((options || {}), {
            type: 'collection'
        }));
    }

    _prepareItem(item) {
        if (item instanceof Immutable.Map) {
            return (!item.has(this.cidAttribute)) ? item.set(this.cidAttribute, uniqueId(this.cidPrefix)) : item;
        }

        return defaults((item || {}), {
            [this.cidAttribute]: uniqueId(this.cidPrefix),
        });
    }

    _getItemId(item) {
        if (item instanceof Immutable.Map) {
            return item.get(this.idAttribute) || item.get(this.cidAttribute);
        }

        if (isObject(item)) {
            return item.id || item.cid;
        }

        return item;
    }

    _add(item) {
        if (this.has(item)) {
            return this._update(this._getItemId(item), item);
        }

        item = this._prepareItem(item);
        this.setState(this.state.push(this._deepConvert(item)));
        return this;
    }
    
    /**
     * item or array or items can be given
     * change will only be fired once
     * 
     * @param {{}|[{}]} items
     */
    add(items) {
        if (Array.isArray(items)) {
            items.forEach((item) => this._add(item));
        } else {
            this._add(items);
        }

        return this;
    }

    _update(id, item) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this._add(item);
        }

        let newState = this.state.update(index, (existingItem) => {
            return existingItem.mergeDeep(this._deepConvert(item));
        });

        this.setState(newState);
        return this;
    }

    update(id, item) {
        if (arguments.length == 1) {
            if (Array.isArray(id)) {
                id.forEach((itemToUpdate) => this._update(itemToUpdate, itemToUpdate));
            } else {
                this._update(id, id);
            }
        }

        if (arguments.length == 2) {
            this._update(id, item);
        }

        return this;
    }

    remove(id) {
        var index = this.findIndex(id);
        if (index === -1) {
            return this;
        }

        this.setState(this.state.remove(index));
        return this;
    }

    clear() {
        this.setState(this.state.clear());
        return this;
    }

    has(id) {
        return !!(this.find(id))
    }

    get size() {
        return this.state.size;
    }

    mutate(cb) {
        this.setState(this.state.withMutations(cb))
    }
}

//finders
[
    'find',
    'findIndex'
].forEach((method) => {
    Collection.prototype[method] = function (id) {
        id = this._getItemId(id);
        return this.state[method]((item) => {
            return (item.get(this.idAttribute) === id || item.get(this.cidAttribute) === id);
        })
    }
});

[
    'includes',
    'contains',
    'indexOf',
    'toJS',
    'toJSON',
    'toArray',
    'toObject'
].forEach((method) => {
    Collection.prototype[method] = function (...rest) {
        return this.state[method].apply(this.state, rest);
    }
});

export default Collection;
