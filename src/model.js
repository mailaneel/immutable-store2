import defaults from 'lodash.defaults';
import EventEmitter from 'eventemitter3';
import Immutable from 'immutable';
import Store from './store';

class Model extends Store {
    constructor(state, options) {
        super(state, Object.assign((options || {}), {
            type: 'model'
        }));
    }
    
}

// persistant changes
['set',
    'delete',
    'remove',
    'clear',
    'update',
    'merge',
    'mergeWith',
    'mergeDeep',
    'mergeDeepWith',
    'setIn',
    'deleteIn',
    'removeIn',
    'updateIn',
    'mergeIn',
    'mergeDeepIn'
].forEach((method) => {
    Model.prototype[method] = function (...rest) {
        this.setState(this.state[method].apply(this.state, rest));
        return this;
    }
});
	
//getters
['get',
    'has',
    'includes',
    'contains',
    'getIn',
    'hasIn',
    'toJS',
    'toArray',
    'toJSON',
    'toObject',
    'keys',
    'values'
].forEach((method) => {
    Model.prototype[method] = function (...rest) {
        return this.state[method].apply(this.state, rest);
    }
});

export default Model;