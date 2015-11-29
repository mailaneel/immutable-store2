import Immutable from 'immutable';
import isObject from 'lodash.isobject';

export function deepConvert(val) {
	val = Immutable.fromJS(val);
	return (isObject(val) && val['toJSON']) ? Immutable.fromJS(val.toJSON()) : val;
}