import Immutable from 'immutable';
import EventEmitter from 'eventemitter3';
import uniqueId from 'lodash.uniqueid';
import defaults from 'lodash.defaults';

export default class Store extends EventEmitter {
	constructor(state, options) {
		super();
		options = defaults((options || {}), {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
			bufferTime: 0, // in ms
			name: uniqueId('store_')
        });
		
		this.name = options.name ;
		this.type = options.type; // collection || model
		this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;
		
	    // we buffer events for predefined time instead of firing change events straight away
        this._isBufferingEvents = false;
        this._bufferTime = options.bufferTime;
		
		this.state = Immutable.fromJS((state) ? state : ((this.type == 'collection') ? [] : {}));
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

	getState() {
		return this.state;
	}
	
	// get access to underlying data structure
	query(){
		return this.state;
	}
}