import _ from 'underscore';

var utils = {
    isCid(id, cidPrefix){
        return (_.isString(id) && (new RegExp(cidPrefix + '.+')).test(id));
    },

    isId(id, cidPrefix){
        return (!this.isCid(id, cidPrefix) && (_.isString(id) || _.isNumber(id)));
    }
};

export default utils;