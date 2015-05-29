'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = Queryable;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _underscoreQuery = require('underscore-query');

var _underscoreQuery2 = _interopRequireDefault(_underscoreQuery);

var _q = (0, _underscoreQuery2['default'])(_underscore2['default'], false);

function Queryable(Collection) {

    return (function (_Collection) {
        function QueryableCollection() {
            _classCallCheck(this, QueryableCollection);

            if (_Collection != null) {
                _Collection.apply(this, arguments);
            }
        }

        _inherits(QueryableCollection, _Collection);

        _createClass(QueryableCollection, [{
            key: 'query',
            value: function query(q) {
                return _q(this.data, q);
            }
        }, {
            key: 'build',
            value: function build() {
                return _q.build(this.data);
            }
        }, {
            key: 'applyQueries',
            value: function applyQueries(collection) {
                _underscore2['default'].each(this.queries, function (query) {
                    query.cb.call(null, collection.query(query));
                });

                return this;
            }
        }, {
            key: 'subscribeToQuery',
            value: function subscribeToQuery(query, cb) {

                if (!this.queries) {
                    this.queries = {};
                    this.on('change', _underscore2['default'].bind(this.applyQueries, this));
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

                return getUnsubscribeFn(queryId);
            }
        }, {
            key: 'unsubscribeFromQuery',
            value: function unsubscribeFromQuery(id) {
                if (this.queries[id]) {
                    delete this.queries[id];
                }

                return this;
            }
        }]);

        return QueryableCollection;
    })(Collection);
}

module.exports = exports['default'];