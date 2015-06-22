import _ from 'underscore';
import EventEmitter from 'eventemitter3';
import Immutable from 'seamless-immutable';
import utils from './utils';

export default class Model extends EventEmitter {
    constructor(attrs, options) {
        super();
        options = _.defaults((options || {}), {
            idAttribute: 'id',
            cidAttribute: 'cid',
            cidPrefix: 'cid_',
            name: _.uniqueId('model_')
        });

        this.name = options.name;
        this.idAttribute = options.idAttribute;
        this.cidAttribute = options.cidAttribute;
        this.cidPrefix = options.cidPrefix;


        this.data = Immutable(this._getDefaultData());

        if(attrs){
            this.set(attrs);
        }
    }

    _getDefaultData(){
        var defaultData = {};
        defaultData[this.cidAttribute] = _.uniqueId(this.cidPrefix);
        return defaultData;
    }

    isCid(id) {
        return utils.isCid(id, this.cidPrefix);
    }

    isId(id) {
        return utils.isId(id, this.cidPrefix);
    }

    set(key, val) {

        var attrs = {};
        if (!_.isObject(key)) {
            attrs[key] = val;
        } else {
            attrs = key;
        }

        var data = this.data.merge(attrs, {deep: true});

        if(data !== this.data){
            this.data = data;
            this._triggerChange();
        }

        return this.data;
    }

    get(key){
        return this.data[key];
    }

    remove(key) {
        if (this.data[key] && (key !== this.cidAttribute)) {
            var data = this.data.asMutable();
            delete data[key];
            this.data = Immutable(data);
            this._triggerChange();
        }

        return this.data;
    }

    clear() {
        this.data = Immutable(this._getDefaultData());
        this._triggerChange();
        return this.data;
    }

    _triggerChange() {
        this.emit('change', this);
    }

    toJSON(){
        return this.data.asMutable({deep: true});
    }
}

_.each([
    'keys', 'values', 'has'
], function (method) {
    Model.prototype[method] = function (...rest) {
        rest.unshift(this.data);
        return _[method].apply(null, rest);
    }
});