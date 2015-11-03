'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _lodashUniqueid = require('lodash.uniqueid');

var _lodashUniqueid2 = _interopRequireDefault(_lodashUniqueid);

var _lodashIsObject = require('lodash.isObject');

var _lodashIsObject2 = _interopRequireDefault(_lodashIsObject);

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var Store = (function (_EventEmitter) {
	_inherits(Store, _EventEmitter);

	function Store(state, options) {
		_classCallCheck(this, Store);

		_EventEmitter.call(this);
		options = _lodashDefaults2['default'](options || {}, {
			idAttribute: 'id',
			cidAttribute: 'cid',
			cidPrefix: 'cid_',
			bufferTime: 0, // in ms
			name: _lodashUniqueid2['default']('store_')
		});

		this.name = options.name;
		this.type = options.type; // collection || model
		this.idAttribute = options.idAttribute;
		this.cidAttribute = options.cidAttribute;
		this.cidPrefix = options.cidPrefix;

		// we buffer events for predefined time instead of firing change events straight away
		this._isBufferingEvents = false;
		this._bufferTime = options.bufferTime;

		state = state && _lodashIsObject2['default'](state) && state['toJSON'] ? state.toJSON() : state;
		this.state = _immutable2['default'].fromJS(state ? state : this.type == 'collection' ? [] : {});
	}

	/**
  * This is to avoid setting mutable objects in immutable structure
  * Ex: {a: {b: Immutable.Map({a: 1}), c: 1}}
  * 
  */

	Store.prototype._deepConvert = function _deepConvert(val) {
		val = _immutable2['default'].fromJS(val);
		return _lodashIsObject2['default'](val) && val['toJSON'] ? _immutable2['default'].fromJS(val.toJSON()) : val;
	};

	Store.prototype.emitChange = function emitChange() {
		var _this = this;

		if (!this._isBufferingEvents) {
			this._isBufferingEvents = true;
			setTimeout(function () {
				_this._isBufferingEvents = false;
				_this.emit('change');
			}, this._bufferTime);
		}

		return this;
	};

	Store.prototype.setState = function setState(state) {
		if (!_immutable2['default'].is(this.state, state)) {
			this.state = state;
			this.emitChange();
		}

		return this;
	};

	Store.prototype.getState = function getState() {
		return this.state;
	};

	/**
  * get access to underlying data structure either Immutable.List or Immutable.Map
  * 
  * Example:
  * var collection = new Collection();
  * var list = collection.query();
  */

	Store.prototype.query = function query() {
		return this.state;
	};

	return Store;
})(_eventemitter32['default']);

exports['default'] = Store;
module.exports = exports['default'];