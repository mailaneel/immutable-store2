import Immutable from 'immutable';
import defaults from 'lodash.defaults';
import uniqueId from 'lodash.uniqueid';
import isObject from 'lodash.isobject';
import {deepConvert} from './utils';

const ID_ATTRIBUTE = 'id';
const CID_ATTRIBUTE = 'cid';
const CID_PREFIX = 'cid_';

function _createFinder(method) {
	return function (list, id) {
		id = _getItemId(id);
		return list[method]((item) => {
			return (item.get(ID_ATTRIBUTE) === id || item.get(CID_ATTRIBUTE) === id);
		})
	}
}

function _getItemId(item) {
	if (item instanceof Immutable.Map) {
		//check if we have id first and then client id
		return item.get(ID_ATTRIBUTE) || item.get(CID_ATTRIBUTE);
	}

	if (isObject(item)) {
		return item[ID_ATTRIBUTE] || item[CID_ATTRIBUTE];
	}

	return item;
}

function _prepareItem(item) {
	if (item instanceof Immutable.Map) {
		return (!item.has(CID_ATTRIBUTE)) ?
			item.set(CID_ATTRIBUTE, uniqueId(CID_PREFIX))
			: item;
	}

	return defaults((item || {}), {
		[CID_ATTRIBUTE]: uniqueId(CID_PREFIX),
	});
};

function _addOne(list, item) {
	if (has(list, item)) {
		return _updateOne(list, item, item);
	}

	item = _prepareItem(item);
	return list.push(deepConvert(item));
};

function _updateOne(list, id, item) {

	if (arguments.length == 2) {
		item = id;
	}

	let index = findIndex(list, id);
	if (index === -1) {
		return _addOne(list, item);
	}

	return list.update(index, (existingItem) => {
		return existingItem.mergeDeep(deepConvert(item));
	});
}

export function has(list, id) {
	return !!find(list, id);
}

export let find = _createFinder('find');
export let findIndex = _createFinder('findIndex');

export function add(list, items) {
	if (items instanceof Immutable.List) {
		items = items.toArray();
	}

	if (Array.isArray(items)) {
		items.forEach((item) => {
			list = _addOne(list, item)
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
export function update(list, id, item) {
	if (arguments.length == 2) {
		if (Array.isArray(id)) {
			id.forEach((itemToUpdate) => {
				list = _updateOne(list, itemToUpdate, itemToUpdate)
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

export function remove(list, id) {
	var index = findIndex(list, id);
	if (index === -1) {
		return list;
	}

	return list.remove(index);
}