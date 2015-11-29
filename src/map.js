import Immutable from 'immutable';
import {deepConvert} from './utils';

function _createSetAndMergerFn(method) {
        return function (map, key, val) {
                return map[method].apply(map, [key, deepConvert(val)]);
        }
}

function _createaUpdateFn(method) {
        return function (map, ...rest) {
                function wrap(fn) {
                        return function (val) {
                                return deepConvert(fn(val));
                        }
                }

                if (rest.length == 2) {
                        rest[1] = wrap(rest[1]);
                }

                if (rest.length === 3) {
                        rest[2] = wrap(rest[2]);
                }

                return map[method].apply(map, rest);
        }
}

export function keys(map) {
        return map.keySeq().toJS();
}

export function values(map) {
        return map.valueSeq().toJS();
}

//persistant changes
export let set = _createSetAndMergerFn('set');
export let setIn = _createSetAndMergerFn('setIn');
export let merge = _createSetAndMergerFn('merge');
export let mergeIn = _createSetAndMergerFn('mergeIn');
export let mergeDeep = _createSetAndMergerFn('mergeDeep');
export let mergeDeepIn = _createSetAndMergerFn('mergeDeepIn');
export let update = _createaUpdateFn('update');
export let updateIn = _createaUpdateFn('updateIn');