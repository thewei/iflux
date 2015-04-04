module.exports = {
    Store: require('./lib/store'),
    Action: require('./lib/actin'),
    mixins: {
        StoreMixin: require('./lib/mixins/store-mixin')
    }
}
