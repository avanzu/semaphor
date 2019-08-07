const { fromPromise }  = require('../lib/intent')

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