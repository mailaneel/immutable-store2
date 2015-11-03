import Immutable from 'immutable';
import defaults from 'lodash.defaults';
import Store from './store';

class Model extends Store {
    constructor(state, options) {
        super(state, Object.assign((options || {}), {
            type: 'model'
        }));
    }

    keys() {
        return this.state.keySeq().toJS();
    }

    values() {
        return this.state.valueSeq().toJS();
    }
}

// persistant changes
[
    'set',
    'setIn',
    'merge',
    'mergeIn',
    'mergeDeep',
    'mergeDeepIn'
].forEach((method) => {
    Model.prototype[method] = function (key, val) {
        this.setState(this.state[method].apply(this.state, [key, this._deepConvert(val)]));
        return this;
    }
});

// persistant changes
[
    'update',
    'updateIn'
].forEach((method) => {
    Model.prototype[method] = function (...args) {

        var self = this;
        function wrap(fn) {
            return function (val) {
                return self._deepConvert(fn(val));
            }
        }

        if (args.length == 2) {
            args[1] = wrap(args[1]);
        }

        if (args.length === 3) {
            args[2] = wrap(args[2]);
        }

        this.setState(this.state[method].apply(this.state, args));
        return this;
    }
});

// persistant changes
[
    'delete',
    'remove',
    'clear',
    'deleteIn',
    'removeIn'
].forEach((method) => {
    Model.prototype[method] = function (...rest) {
        this.setState(this.state[method].apply(this.state, rest));
        return this;
    }
});
	
//getters
[
    'get',
    'has',
    'includes',
    'contains',
    'getIn',
    'hasIn',
    'toJS',
    'toArray',
    'toJSON',
    'toObject'
].forEach((method) => {
    Model.prototype[method] = function (...rest) {
        return this.state[method].apply(this.state, rest);
    }
});

export default Model;