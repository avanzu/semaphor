
const app          = require('./app')     // load a semaphor app
const configureAPI = require('./api')     // load your api module
const subscribeTo  = require('./events')  // load your event/intent listeners

// subscribe anywhere before the actual function in question is executed
subscribeTo(app) 

// build your api connection
const { sayHello, sayGoodBye } = configureAPI(app)  


sayHello('http://www.example.api/v2/hello')
    .then(console.log)
    .catch(console.error)

sayGoodBye('http://www.example.api/v2/good-bye')
    .then(console.log)
    .catch(console.error)
