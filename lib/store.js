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

var Store = (function (_EventEmitter) {
	_inherits(Store, _EventEmitter);

	function Store(state, options) {
		_classCallCheck(this, Store);

		_EventEmitter.call(this);
		this.name = options.name || _lodashUniqueid2['default']('store_');
		this.type = options.type; // collection || model
		this.idAttribute = options.idAttribute;
		this.cidAttribute = options.cidAttribute;
		this.cidPrefix = options.cidPrefix;
		this.state = _immutable2['default'].fromJS(state ? state : this.type == 'collection' ? [] : {});
	}

	Store.prototype.emitChange = function emitChange() {
		this.emit('change');
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

	// get access to underlying data structure

	Store.prototype.query = function query() {
		return this.state;
	};

	return Store;
})(_eventemitter32['default']);

exports['default'] = Store;
module.exports = exports['default'];