import Immutable from 'immutable';
import EventEmitter from 'eventemitter3';
import uniqueId from 'lodash.uniqueid'

export default class Store extends EventEmitter {
	constructor(state, options) {
		super();
		this.name = options.name || uniqueId('store_');
		this.type = options.type; // collection || model
		this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;
		this.state = Immutable.fromJS((state) ? state : ((this.type == 'collection') ? [] : {}));
	}
	emitChange() {
		this.emit('change');
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