import React from 'react';
import _ from 'underscore';


/**
 *
 * @see https://github.com/mailaneel/mingo
 *
 *
 * getStoreQueries(nextProps){
 *   return {
 *   comments : {
 *          mostLiked: {
 *             query: {
 *                likes: {
 *                  $gt: 10000
 *               }
 *             },
 *             sort: {}
 *             limit: 10,
 *             skip: 0
 *          }
 *       }
 *    }
 * }
 *
 * Example:
 * var _queries = {
 *       'storeName': {
 *           // you can access this using this.state.statePropName
 *           'statePropName': {
 *              query: {},
 *              sort: {},
 *              limit: 10,
 *              skip: 0
 *           }
 *       }
 * };
 *
 */

export default {

    _storeSubscriptions: {},

    contextTypes: {
        queryable_stores: React.PropTypes.object
    },

    childContextTypes: {
        queryable_stores: React.PropTypes.object
    },

    getChildContext: function () {
        return {
            // all stores that can be queried
            queryable_stores: this.getQueryableStores()
        }
    },

    getQueryableStores(){
        return this.props.queryable_stores || (this.context && this.context.queryable_stores);
    },

    componentWillMount(){
        if (!this['getStoreQueries']) {
            throw new Error('component should implement getStoreQueries');
        }
        this.subscribeToStores(this['getStoreQueries'](this.props));
    },

    componentWillUnmount(){
        this.unSubscribeFromStores();
    },

    componentWillReceiveProps(nextProps){
        if (!this['getStoreQueries']) {
            throw new Error('component should implement getStoreQueries');
        }
        this.subscribeToStores(this['getStoreQueries'](nextProps));
    },

    subscribeToStores(queries){

        if (!queries) {
            return false;
        }

        var self = this;
        var store;
        var existingStoreSubscriptions = _.keys(this._storeSubscriptions);
        var newStoresToSubscribe = _.keys(queries);
        var removeSubscriptions = _.difference(existingStoreSubscriptions, newStoresToSubscribe);

        _.each(removeSubscriptions, function (storeName) {
            self.unSubscribeFromStore(storeName);
        });

        _.each(queries, function (storeQueries, storeName) {
            store = self.getQueryableStores()[storeName];

            if (!store) {
                throw new Error('store does not exist in flux ', storeName);
            }

            if (self.hasSubscribeToStore(storeName)){
                self._storeSubscriptions[storeName].queries = storeQueries;
                self._updateState(self._queryStore(store, storeQueries));
            }else{
                self._storeSubscriptions[storeName] = {
                    listener: self._getListenerForStore(storeName),
                    queries: storeQueries,
                    store: store
                };
            }

            store.on('change', self._storeSubscriptions[storeName]['listener']);
        });


        return this;
    },

    hasSubscribeToStore(storeName){
        return !!(this._storeSubscriptions[storeName]);
    },

    unSubscribeFromStore(storeName){
        if (this.hasSubscribeToStore(storeName)) {
            this.getQueryableStores()[storeName].removeListener('change', this._storeSubscriptions[storeName].listener);
            delete this._storeSubscriptions[storeName];
        }

        return this;
    },

    unSubscribeFromStores(){
        var self = this;
        _.each(this._storeSubscriptions, function (fn, storeName) {
            self.unSubscribeFromStore(storeName);
        });

        this._storeSubscriptions = {};

        return this;
    },

    _queryStore(store, queries){

        var state = {};
        _.each(queries, function (query, statePropName) {
            var cursor = store.query(query['query'], query['projection']);
            if (query['sort']) {
                cursor.sort(query['sort']);
            }

            if (query['limit']) {
                cursor.limit(query['limit']);
            }

            if (query['skip']) {
                cursor.skip(query['skip']);
            }

            state[statePropName] = cursor.all();
        });

        return state;
    },

    _updateState(state){
        this.setState(state);
    },

    _getListenerForStore(storeName){
        var self = this;

        return function () {
            // this is to make sure we are still subscribed to store
            if (!self.hasSubscribeToStore(storeName)) {
                return;
            }

            var store = self._storeSubscriptions[storeName].store;
            var queries = self._storeSubscriptions[storeName].queries;
            self._updateState(self._queryStore(store, queries));
        };
    }

};