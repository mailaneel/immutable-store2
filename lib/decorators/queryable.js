'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = Queryable;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _underscoreQuery = require('underscore-query');

var _underscoreQuery2 = _interopRequireDefault(_underscoreQuery);

var _q = (0, _underscoreQuery2['default'])(_underscore2['default'], false);

/**
 *
 * subscribed query will be run against collection's data
 * every time there is change in collection and then calls callback given
 *
 * please see tests for now
 *
 *
 * @param Collection
 * @returns {*}
 * @constructor
 */

function Queryable(Collection) {

    return (function (_Collection) {
        function QueryableCollection() {
            _classCallCheck(this, QueryableCollection);

            if (_Collection != null) {
                _Collection.apply(this, arguments);
            }
        }

        _inherits(QueryableCollection, _Collection);

        QueryableCollection.prototype.query = function query(q) {
            return _q(this.data, q);
        };

        QueryableCollection.prototype.buildQuery = function buildQuery() {
            return _q.build(this.data);
        };

        QueryableCollection.prototype.applyQuery = function applyQuery(query) {
            var self = this;
            setTimeout(function () {
                query.cb.call(null, self.query(query.query));
            }, 0);

            return this;
        };

        QueryableCollection.prototype.applyAllQueries = function applyAllQueries() {
            var self = this;
            _underscore2['default'].each(this.queries, function (query) {
                self.applyQuery(query);
            });

            return this;
        };

        QueryableCollection.prototype.subscribeToQuery = function subscribeToQuery(query, cb) {

            if (!this.queries) {
                this.queries = {};
                this.on('change', _underscore2['default'].bind(this.applyAllQueries, this));
            }

            var self = this;
            var getUnsubscribeFn = function getUnsubscribeFn(id) {
                return {
                    unsubscribe: function unsubscribe() {
                        self.unsubscribeFromQuery(id);
                    }
                };
            };

            var queryId = _underscore2['default'].uniqueId();
            this.queries[queryId] = {
                query: query,
                cb: cb
            };

            // if collection has got data already we should execute query and callback
            this.applyQuery(this.queries[queryId]);
            return getUnsubscribeFn(queryId);
        };

        QueryableCollection.prototype.unsubscribeFromQuery = function unsubscribeFromQuery(id) {
            if (this.queries[id]) {
                delete this.queries[id];
            }

            return this;
        };

        return QueryableCollection;
    })(Collection);
}

module.exports = exports['default'];