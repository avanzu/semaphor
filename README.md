# Deed poll
Event based middleware alternative.

## About intents
Conceptually, an intent can be seen as an event that is _about to happen_ unless stated otherwise. Technically, it is an event which gives control to the outside world. 

## What can you do with intents
Since intents are quite similar to a traditional middleware, you can achieve pretty much anything that a middleware can do. 

### extend and augment funcitonality 
Imagine something like a simple call to an external API and let's assume that this API did not have any authentication during your development process. 
As time goes by that particular API gets more and more popular and  someone decides that some form of authentication becomes necessary. 

Since nothing about the API itself changes, your code has effectively no reason to change. 

```js 
// src/api.js

module.exports = app => {

    // the original function does not provide an "authorization" header
    
    const headers = { 'content-type' : 'application/json' }

    
    const sayHello = url => 
        app // give control to the outside world
            .signal('AboutToSayHello', { headers }) 
            .toPromise()
            .then(apiCallHello(url))

    const sayGoodBye = url => 
        app // give control to the outside world
            .signal('AboutToSayBye', { headers }) 
            .toPromise()
            .then(apiCallGoodBye(url))

            
    return { sayHello, sayGoodBye }
}

```
Having an intent in place will save your bacon.
```js 

// src/events.js 

const { fromPromise }  = require('deed-poll/lib/intent')

/**
 * fake storage for demonstration purposes
 */
const storage = ({
    find: key => 
        key == 'hello-auth' 
            ? Promise.resolve('1e54b332-b123-4187-a85c-6d082236bff6') 
            : Promise.reject(`invalid key ${key}`)
})

/**
 * Transforms the storage promise into an Intent
 * 
 * @summary authenticate :: String a -> Intent(b)
 */
const authenticate = key => fromPromise(storage.find(key))

/**
 * Adds (or overwrites) the authorization string to the headers key
 * 
 * @summary addAuthHeaderTo :: Object a -> String b -> Object c 
 */
const addAuthHeaderTo = ({headers, ...rest}) => authorization => ({
    headers: { ...headers, authorization }, ...rest
})

/**
 * Tries to authenticate using 'hello-auth'.
 * This will always resolve and adds the auth header to the given context.
 * 
 * @summary addAuthenticationHeader :: Object a -> Intent(a)
 */
const addAuthenticationHeader = context => 
    authenticate('hello-auth').map(addAuthHeaderTo(context))


module.exports = app => {
    app.on('AboutToSayHello', intent => intent.chain(addAuthenticationHeader))
}
```

### Prevent something from happening
Going back to the previous example, the `sayGoodBye` call will also be rejected due to the authentication. But, as of yet, the API call will be done anyways, although it is sure to fail. 

We could use the same trick as before but let's further assume that the authorization for this call is different to the first one.

```js 

//src/events.js 

// ....

/**
 * Tries to authenticate using 'bye-auth'.
 * This will always be rejected and therefore prevent the acutal API call.
 * @summary addInvalidAuthenticationHeader :: Object a -> Intent(a)
 */    
const addInvalidAuthenticationHeader = context  => 
    authenticate('bye-auth').map(addAuthHeaderTo(context))

module.exports = app => {

    app.on('AboutToSayHello', intent => intent.chain(addAuthenticationHeader))
    app.on('AboutToSayBye',   intent => intent.chain(addInvalidAuthenticationHeader))
    
}
```
Since retrieving a viable authentication for `'bye-auth'` is impossible, we are chaining a rejected intent. This, in turn, will prevent the actual API call (unless you catch it beforehand) and provide a (probably) more informative error message.

