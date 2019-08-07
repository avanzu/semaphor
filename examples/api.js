

/**
 * Demonstrates an arbitrary API call 
 * which rejects anything without an authorization header.
 * 
 * @summary apiCallHello :: String url -> Object options -> Promise
 */
const apiCallHello = url => ({headers}) => new Promise((resolve, reject) => 
    headers.authorization 
        ? resolve(`Hi! You called ${url}`) 
        : reject(`Sorry, not authenticated to fetch from ${url}`))

/**
 * Demonstrates another arbitrary API call 
 * which rejects anything without an authorization header.
 * 
 * @summary apiCallHello :: String url -> Object options -> Promise
 */        
const apiCallGoodBye = url => ({headers}) => new Promise((resolve, reject) => 
    headers.authorization 
        ? resolve(`Good bye from ${url}`) 
        : reject(`Sorry, not authenticated to call ${url}`))

        
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