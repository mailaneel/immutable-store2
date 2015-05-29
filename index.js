module.exports = {
    Store: require('./lib/store'),
    CollectionClass: require('./lib/collection'), // only use this for dev or extension
    LocalStorageAware: require('./lib/decorators/local-store'),
    Immutable: require('./lib/decorators/immutable'),
    Queryable: require('./lib/decorators/queryable'),
    Collection: require('./lib/decorators/collection')
};