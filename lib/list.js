'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.has = has;
exports.add = add;
exports.update = update;
exports.remove = remove;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

var _lodashUtilityUniqueId = require('lodash/utility/uniqueId');

var _lodashUtilityUniqueId2 = _interopRequireDefault(_lodashUtilityUniqueId);

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var _utils = require('./utils');

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
	if (item instanceof _immutable2['default'].Map) {
		//check if we have id first and then client id
		return item.get(ID_ATTRIBUTE) || item.get(CID_ATTRIBUTE);
	}

	if (_lodashLangIsObject2['default'](item)) {
		return item[ID_ATTRIBUTE] || item[CID_ATTRIBUTE];
	}

	return item;
}

function _prepareItem(item) {
	var _defaults;

	if (item instanceof _immutable2['default'].Map) {
		return !item.has(CID_ATTRIBUTE) ? item.set(CID_ATTRIBUTE, _lodashUtilityUniqueId2['default'](CID_PREFIX)) : item;
	}

	return _lodashObjectDefaults2['default'](item || {}, (_defaults = {}, _defaults[CID_ATTRIBUTE] = _lodashUtilityUniqueId2['default'](CID_PREFIX), _defaults));
};

function _addOne(list, item) {

	if (!item) {
		return list;
	}

	if (has(list, item)) {
		return _updateOne(list, item, item);
	}

	item = _prepareItem(item);
	return list.push(_utils.deepConvert(item));
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
		return existingItem.mergeDeep(_utils.deepConvert(item));
	});
}

function has(list, id) {
	return !!find(list, id);
}

var find = _createFinder('find');
exports.find = find;
var findIndex = _createFinder('findIndex');

exports.findIndex = findIndex;

function add(list, items) {
	if (items instanceof _immutable2['default'].List) {
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