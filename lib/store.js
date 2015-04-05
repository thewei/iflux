var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor/index');
var Action = require('./action')
var _ = require('./utils');

var is = Immutable.is.bind(Immutable),
    getKeys = Object.keys.bind(Object);

function shallowEqualImmutable(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }
    var keysA = getKeys(objA),
        keysB = getKeys(objB),
        keysAlength = keysA.length,
        keysBlength = keysB.length

    if (keysAlength !== keysBlength) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysAlength; i++) {
        if (!objB.hasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    // Now we dont need to test for B's keys missing from A,
    // because if length's is same and prev check success - objB hasn't more keys
    return true;
}

/**
 * Store
 * @param obj
 */
function Store(data) {
    if (!(this instanceof Store)) return new Store(data);

    //当前应用的数据
    this.data = Immutable.fromJS(data || {});

    //缓存初始状态的值
    this.initData = this.data;

    /**
     * 暴露给外面的方法
     */
    return {
        getData: this.getData.bind(this),
        getStore: this.getStore.bind(this),
        reset: this.reset.bind(this)
    };
};


/**
 * get all Data
 */
Store.prototype.getData = function() {
    return this.data;
};


/**
 * get one store
 */
Store.prototype.getStore = function(keyPath) {

    var keyPath = [keyPath] || [];

    var change = function(nextState, preState, path) {

        var nextData = nextState[_.isArray(path) ? 'getIn' : 'get'](path);

        _.log(
            'cursor path: [', path.join("."), '] store: ', (typeof(nextData) !== 'undefined' && nextData != null) ? nextData.toString() : 'was deleted.'
        );

        if (!shallowEqualImmutable(preState, this.data)) {
            throw new Error('attempted to altere expired data.');
        }

        this.data = nextState;

        if(keyPath.length){
            keyPath.map(function(key){
                Action.emit("_storeChange:"+key);
            });
        }else{
            Action.emit("_storeChange");
        }

        //
        Action.emit("_updateStore",nextState);

    }.bind(this);

    return Cursor.from(this.data,keyPath, change);
};


/**
 * reset Data
 *
 * @param path
 */
Store.prototype.reset = function(path) {
    if (path) {
        var isArray = _.isArray(path);
        var initVal = this.initData[isArray ? 'getIn' : 'get'](path);

        //set
        this.getStore()[isArray ? 'setIn' : 'set'](path, initVal);
    } else {
        //initial data
        this.data = this.initData;
        this.callbacks.forEach(function(callback) {
            callback(this.data);
        });
    }
};


module.exports = Store;
