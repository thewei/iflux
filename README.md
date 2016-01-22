# react-native-immutable
**using immutable.js library as store with react && react-native**

More info of [immutable.js](http://facebook.github.io/immutable-js/)

---


## Installation

```
$ npm install react-native-immutable --save
```

## Useage

```
react-native project
   |---index.ios.js
   |---App
         |---Actions
         	   |--- mainAction.js
         	   |--- userAction.js
         	   |--- articleAction.js
         	   |--- ...
         |---Stores
         	   |--- mainStore.js
         	   |--- userStore.js
         	   |--- articleStore.js
         	   |--- ...
         |---Webapi
         
```

### index.ios.js

```javascript
'use strict';

var React = require('react-native');

var { mixins } = require('react-native-immutable');
var StoreMixin = mixins.StoreMixin;
var appStore = require('./App/Stores/mainStore');
var appAction = require('./App/Actions/mainAction');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text
} = React;

var App = React.createClass({
    mixins: [StoreMixin(appStore,"user","article")],
    onChangeUserName: function(){
    	appAction.emit('onChangeUserName', "wilson");
    },
    render: function() {
        
        console.log(this.state);  // when store was changed, the state will change;
        
        console.log(this.state.username)
        
        return (
        	<View>
        		<Text onPress={this.onChangeUserName}>Change user name</Text>
        	</View>
        )   
    } 
});
    
    
AppRegistry.registerComponent('DEMO', () => App);

```


### mainAction.js

```javascript
'use strict';

var {Action} = require('react-native-immutable');

// require userAction
require('./userAction')();


// require articleAction
require('./articleAction')();

module.exports = Action;

```


### userAction.js

```javascript
'use strict';

var Immutable = require('immutable');
var {Action} = require('react-native-immutable');
var appStore = require('../Stores/mainStore');

// 更新管理员
var userAction = function(){
	Action.on('onChangeUserName', function(name) {
		// study immutable.js visit http://facebook.github.io/immutable-js/
    	appStore.getStore("user").set('name', name );
	});
}

module.exports = userAction;

```

### mainStore.js

```javascript
'use strict'

var Immutable = require('immutable');
var {Store,Action} = require('react-native-immutable');

var React = require('react-native');



var appStore = module.exports = Store({
    user: require('./userStore'),
    article: require('./articleStore')
});


// Use AsyncStorage if u what

var {
    AsyncStorage
} = React;

var db_name = "app_store";

Action.on("_updateStore", function(data){
    AsyncStorage.setItem(db_name, JSON.stringify(data), function(err) {
        if (err) {
            console.error("error")
        }
    });
});

//initial Data
AsyncStorage.getItem(db_name, function(err, res) {
    if (err) {
        console.error("error")
    } else {
        if( typeof res == undefined ){
            Action.emit("_updateStore",appStore.getData());
        }else{
            appStore = Immutable.fromJS(JSON.parse(res));
        }
    }
});


```

### userStore.js

```javascript
'use strict'

module.exports = {
    name: ''
}

```

