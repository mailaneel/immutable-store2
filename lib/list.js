'use strict';

exports.__esModule = true;
exports.findIndex = exports.find = undefined;
exports.has = has;
exports.add = add;
exports.update = update;
exports.remove = remove;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _isObject = require('lodash/lang/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _uniqueId = require('lodash/utility/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _defaults2 = require('lodash/object/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ID_ATTRIBUTE = 'id';
var CID_ATTRIBUTE = 'cid';
var CID_PREFIX = 'cid_';

function _createFinder(method) {
	return function (list, id) {
		id = _getItemId(id);
		return list[method](function (item) {
			return item.get(ID_ATTRIBUTE) === id || item.get(CID_ATTRIBUTE) === id;
		});
	};
}

function _getItemId(item) {
	if (item instanceof _immutable2.default.Map) {
		//check if we have id first and then client id
		return item.get(ID_ATTRIBUTE) || item.get(CID_ATTRIBUTE);
	}

	if ((0, _isObject2.default)(item)) {
		return item[ID_ATTRIBUTE] || item[CID_ATTRIBUTE];
	}

	return item;
}

function _prepareItem(item) {
	var _defaults;

	if (item instanceof _immutable2.default.Map) {
		return !item.has(CID_ATTRIBUTE) ? item.set(CID_ATTRIBUTE, (0, _uniqueId2.default)(CID_PREFIX)) : item;
	}

	return (0, _defaults3.default)(item || {}, (_defaults = {}, _defaults[CID_ATTRIBUTE] = (0, _uniqueId2.default)(CID_PREFIX), _defaults));
};

function _addOne(list, item) {

	if (!item) {
		return list;
	}

	if (has(list, item)) {
		return _updateOne(list, item, item);
	}

	item = _prepareItem(item);
	return list.push((0, _utils.deepConvert)(item));
};

function _updateOne(list, id, item) {

	if (arguments.length == 2) {
		item = id;
	}

	var index = findIndex(list, id);
	if (index === -1) {
		return _addOne(list, item);
	}

	return list.update(index, function (existingItem) {
		return existingItem.mergeDeep((0, _utils.deepConvert)(item));
	});
}

function has(list, id) {
	return !!find(list, id);
}

var find = exports.find = _createFinder('find');
var findIndex = exports.findIndex = _createFinder('findIndex');

function add(list, items) {
	if (items instanceof _immutable2.default.List) {
		items = items.toArray();
	}

	if (Array.isArray(items)) {
		items.forEach(function (item) {
			list = _addOne(list, item);
		});
	} else {
		list = _addOne(list, items);
	}

	return list;
}

/**
 * @param {{}} list
 * @param {{}|[{}]|string|number} id if given item or list of items second parameter is optional, 
 * if id of item is given second parameter is required
 * @param {{}} [item] item to update
 */
function update(list, id, item) {
	if (arguments.length == 2) {
		if (Array.isArray(id)) {
			id.forEach(function (itemToUpdate) {
				list = _updateOne(list, itemToUpdate, itemToUpdate);
			});
		} else {
			list = _updateOne(list, id, id);
		}
	}

	if (arguments.length == 3) {
		list = _updateOne(list, id, item);
	}

	return list;
}

function remove(list, id) {
	var index = findIndex(list, id);
	if (index === -1) {
		return list;
	}

	return list.remove(index);
}