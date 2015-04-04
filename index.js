module.exports = {
    Store: require('./lib/store'),
    Action: require('./lib/action'),
    mixins: {
        StoreMixin: require('./lib/mixins/store-mixin')
    }
}
