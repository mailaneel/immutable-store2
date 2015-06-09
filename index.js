module.exports = {
    Store: require('./lib/store'),
    Collection: require('./lib/collection'), // only use this for dev or extension
    Model: require('./lib/model'),
    LocalStorageAware: require('./lib/decorators/local-store'),
    Queryable: require('./lib/decorators/queryable'),
};