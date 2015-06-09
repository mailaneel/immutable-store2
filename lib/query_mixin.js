'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

/**
 *
 * @see https://github.com/davidgtonge/underscore-query
 *
 *
 * getStoreQueries(nextProps){
 *   return {
 *   'comments' : {
 *          'mostLiked': {likes: {$gt: 10000}}
 *       }
 *    }
 * }
 *
 * Example:
 * var _queries = {
 *       'storeName': {
 *           'statePropName': {} // query
 *       }
 * };
 *
 */

exports['default'] = {

    _storeSubscriptions: {},

    contextTypes: {
        queryable_stores: _react2['default'].PropTypes.object
    },

    childContextTypes: {
        queryable_stores: _react2['default'].PropTypes.object
    },

    getChildContext: function getChildContext() {
        return {
            // all stores that can be queried
            queryable_stores: this.getQueryableStores()
        };
    },

    getQueryableStores: function getQueryableStores() {
        return this.props.queryable_stores || this.context && this.context.queryable_stores;
    },

    componentWillMount: function componentWillMount() {
        if (!this['getStoreQueries']) {
            throw new Error('component should implement getStoreQueries');
        }
        this.subscribeToStores(this['getStoreQueries'](this.props));
    },

    componentWillUnmount: function componentWillUnmount() {
        this.unSubscribeFromStores();
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (!this['getStoreQueries']) {
            throw new Error('component should implement getStoreQueries');
        }
        this.subscribeToStores(this['getStoreQueries'](nextProps));
    },

    subscribeToStores: function subscribeToStores(queries) {
        this.unSubscribeFromStores();

        if (!queries) {
            return false;
        }

        var self = this;
        var store;
        _underscore2['default'].each(queries, function (storeQueries, storeName) {
            store = self.getQueryableStores()[storeName];

            if (!store) {
                throw new Error('store does not exist in flux ', storeName);
            }

            self._storeSubscriptions[storeName] = self._getListenerForStore(storeQueries);
            store.on('change', self._storeSubscriptions[storeName]);
        });

        return this;
    },

    _getListenerForStore: function _getListenerForStore(queries) {
        var self = this;
        return function (store) {
            _underscore2['default'].each(queries, function (query, statePropName) {
                var state = {};
                state[statePropName] = store.query(query);
                self.setState(state);
            });
        };
    },

    unSubscribeFromStores: function unSubscribeFromStores() {
        var self = this;
        _underscore2['default'].each(this._storeSubscriptions, function (fn, storeName) {
            self.getQueryableStores()[storeName].removeListener('change', fn);
        });

        this._storeSubscriptions = {};

        return this;
    }

};
module.exports = exports['default'];