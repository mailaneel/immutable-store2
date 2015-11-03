import Immutable from 'immutable';
import EventEmitter from 'eventemitter3';
import uniqueId from 'lodash.uniqueid';
import isObject from 'lodash.isObject';
import defaults from 'lodash.defaults';

export default class Store extends EventEmitter {
	constructor(state, options) {
		super();
		options = defaults((options || {}), {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
			bufferTime: 0, // in ms
			name: uniqueId(options.type + '_')
        });
		
		this.name = options.name ;
		this.type = options.type; // collection || model
		
		if(!this.type || ['collection', 'model'].indexOf(this.type) === -1){
			throw new Error('type property is required in options. supported values are collection, model');
		}
		
		this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;
		
	    // we buffer events for predefined time instead of firing change events straight away
        this._isBufferingEvents = false;
        this._bufferTime = options.bufferTime;

		this.state = this._deepConvert((state) ? state : ((this.type == 'collection') ? [] : {}));
	}
	
	/**
	 * This is to avoid setting mutable objects in immutable structure
	 * Ex: {a: {b: Immutable.Map({a: 1}), c: 1}}
	 * 
	 */
	_deepConvert(val){
		val = Immutable.fromJS(val);
		return (isObject(val) && val['toJSON'])? Immutable.fromJS(val.toJSON()) : val;
	}
	
	emitChange() {
		if (!this._isBufferingEvents) {
            this._isBufferingEvents = true;
            setTimeout( () => {
                this._isBufferingEvents = false;
                this.emit('change');
            }, this._bufferTime);
        }
		
		return this;
	}

	setState(state) {
		if (!Immutable.is(this.state, state)) {
			this.state = state;
			this.emitChange()
		}

		return this;
	}

	/**
	 * get access to underlying data structure either Immutable.List or Immutable.Map
	 * 
	 * Example:
	 * var collection = new Collection();
	 * var list = collection.query();
	 */
	getState() {
		return this.state;
	}	
}