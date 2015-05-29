import _ from 'underscore';
import _Query from 'underscore-query';
var _q = _Query(_, false);


export default function Queryable(Collection) {

    return class QueryableCollection extends Collection{
        query(q) {
            return _q(this.data, q);
        };

        build() {
            return _q.build(this.data);
        };

        applyQueries(collection){
            _.each(this.queries, function(query){
                query.cb.call(null, collection.query(query));
            });

            return this;
        };

        subscribeToQuery(query, cb) {

            if (!this.queries) {
                this.queries = {};
                this.on('change', _.bind(this.applyQueries, this));
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