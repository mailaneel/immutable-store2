module.exports = {
    Store: require('./lib/store'),
    CollectionClass: require('./lib/collection'), // only use this for dev or extension
    ModelClass: require('./lib/model'),
    LocalStorageAware: require('./lib/decorators/local-store'),
    Queryable: require('./lib/decorators/queryable'),
    Collection: require('./lib/decorators/collection'),
    Model: require('./lib/decorators/model')
};