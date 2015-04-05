var Action = require('../action');

module.exports = function() {
    var storeNames = Array.prototype.slice.call(arguments);
    var store = storeNames.shift();
    return {

        getInitialState: function() {
            return this._getStateFromStore();
        },

        componentDidMount: function() {
            var _this = this;
            if(storeNames.length){
                storeNames.map(function(storeName){
                    Action.on("_storeChange:"+storeName,_this._setStateFromStore);
                });
            }else{
                Action.on("_storeChange");
            }
        },

        componentWillUnmount: function(){
            var _this = this;
            if(storeNames.length){
                storeNames.map(function(storeName){
                    Action.off("_storeChange:"+storeName,_this._setStateFromStore);
                });
            }else{
                Action.off("_storeChange");
            }

        },

        _setStateFromStore: function(){
            if (this.isMounted()) {
                this.setState(this._getStateFromStore());
            }
        },
        _getStateFromStore: function(){
            var ret = {};
            storeNames.map(function(storeName){
                ret[storeName] = store.getData().get(storeName).toJS()
            });
            return ret;
        }
    };
}
