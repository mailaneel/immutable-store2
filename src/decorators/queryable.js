import _ from 'underscore';
import _Query from 'underscore-query';
var _q = _Query(_, false);

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
export default function Queryable(Collection) {

    return class QueryableCollection extends Collection{
        query(q) {
            return _q(this.data, q);
        };

        buildQuery() {
            return _q.build(this.data);
        };

        applyQuery(query){
            var self = this;
            setTimeout(function(){
                query.cb.call(null, self.query(query.query));
            }, 0);

            return this;
        }

        applyAllQueries(){
            var self = this;
            _.each(this.queries, function(query){
                self.applyQuery(query);
            });

            return this;
        };

        subscribeToQuery(query, cb) {

            if (!this.queries) {
                this.queries = {};
                this.on('change', _.bind(this.applyAllQueries, this));
            }

            var self = this;
            var getUnsubscribeFn = function(id) {
                return {
                    unsubscribe: function () {
                        self.unsubscribeFromQuery(id);
                    }
                };
            };

            var queryId = _.uniqueId();
            this.queries[queryId] = {
                query: query,
                cb: cb
            };

            // if collection has got data already we should execute query and callback
            this.applyQuery(this.queries[queryId]);
            return getUnsubscribeFn(queryId);
        };

        unsubscribeFromQuery(id) {
            if (this.queries[id]) {
                delete this.queries[id];
            }

            return this;
        }
    }
}