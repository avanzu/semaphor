# Semaphor
Event based middleware alternative.

## About intents
Conceptually, an intent can be seen as an event that is _about to happen_ unless stated otherwise. Technically, it is an event which gives control to the outside world. 

## What can you do with intents
Since intents are quite similar to a traditional middleware, you can achieve pretty much anything that a middleware can do. 

### extend and augment funcitonality 
Imagine something like a simple call to an external API and let's assume that this API did not have any authentication during your development process. 
As time goes by that particular API gets more and more popular and  someone decides that some form of authentication becomes necessary. 

Since nothing about the API itself changes, your code has effectively no reason to change. 

Having an intent in place will save your bacon.

__basic functionality example__
```js 
// src/api/hello-world.js
const app = require('./app')
const httpGet = require('./your-http-module-of-choice')
const sayHello = locale => 
  app.signal('AboutToSayHello', { 
    headers: {
      'content-type'    : 'application/json',
      'accept-language' : locale
    }})
     .toPromise() 
     .then(options => 
        httpGet('http://my.api.com/hello', options))
     
```

__extend on basic functionality__
```js
// src/intents/hello.js

const app      = require('./app')
const {Intent} = require('semaphor')
const storage  = require('./some-promise-based-token-storage')

// authenticate :: string -> Intent
const authenticate = key => storage.find(key).then(Intent.of).catch(Intent.rejected)

// addAuthenticationHeader :: context -> Intent(context)
const addAuthenticationHeader = context => 
  authenticate('hello-auth').map( authorization => {
    Object.assign(context.headers, {authorization})
    return context
  })


app.on('AboutToSayHello', intent => intent.chain( addAuthenticationHeader ))
```



### Prevent something from happening



### Recover from errors

