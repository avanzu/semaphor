const Semaphor = require('./lib/semaphor')
const Task = require('data.task')
const Intent = require('./lib/intent')

const inspect = label => value => {
    console.log(label, value)
    return value
}
describe('handling intents', () => {

    const app = new Semaphor()
  
    it('should do stuff', async () => {
      
        app.on('SomethingWillHappen', intent => intent.map( context => Object.assign(context, { foo: 'bar' })))
        app.on('SomethingWillHappen', intent => intent.chain( context => Task.of(Object.assign(context, { baz: 'nuff' }))))
        app.on('SomethingWillHappen', intent => intent.chain( context => Task.rejected(new Error('no good', context))))

        app.signal('SomethingWillHappen', {}).fork(bad => console.error('bad', bad), good => console.log('good', good) )



    })



})