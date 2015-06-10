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
        this.unSubscribeFromStores();

        if (!queries) {
            return false;
        }

        var self = this;
        var store;
        _.each(queries, function (storeQueries, storeName) {
            store = self.getQueryableStores()[storeName];

            if (!store) {
                throw new Error('store does not exist in flux ', storeName);
            }

            self._storeSubscriptions[storeName] = self._getListenerForStore(store, storeQueries);
            store.on('change', self._storeSubscriptions[storeName]);
        });


        return this;
    },

    _getListenerForStore(store, queries){
        var self = this;
        return function(){
            _.each(queries, function(query, statePropName){
                var cursor = store.query(query['query'], query['projection']);
                if(query['sort']){
                    cursor.sort(query['sort']);
                }

                if(query['limit']){
                    cursor.limit(query['limit']);
                }

                if(query['skip']){
                    cursor.skip(query['skip']);
                }

                var state = {};
                state[statePropName] = cursor.all();
                self.setState(state);
            });
        };
    },

    unSubscribeFromStores(){
        var self = this;
        _.each(this._storeSubscriptions, function (fn, storeName) {
            self.getQueryableStores()[storeName].removeListener('change', fn);
        });

        this._storeSubscriptions = {};

        return this;
    }

};