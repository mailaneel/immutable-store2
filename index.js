module.exports = {
    Store: require('./lib/store'),
    Collection: require('./lib/collection'),
    LocalStorageAware: require('./lib/decorators/local-store'),
    Immutable: require('./lib/decorators/immutable'),
    Queryable: require('./lib/decorators/queryable')
};