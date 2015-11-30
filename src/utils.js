import Immutable from 'immutable';
import _ from 'lodash';

export function deepConvert(val) {
	val = Immutable.fromJS(val);
	return (_.isObject(val) && val['toJSON']) ? Immutable.fromJS(val.toJSON()) : val;
}