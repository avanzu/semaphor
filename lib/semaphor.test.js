const EventEmitter = require('events')
const Semaphor = require('./semaphor')
describe('Semaphor', () => {

    it('should be an EventEmitter', () => {

        const semaphor = new Semaphor()
        expect(semaphor).toBeInstanceOf(EventEmitter)
    })

    it('should signal intents', async () => {
      
        const semaphor = new Semaphor()
        semaphor.on('something', intent => intent.map( x => x * 2 ))

        const promise = semaphor.signal('something', 2).toPromise()
        await expect(promise).resolves.toEqual(4)
    })

    it('should be self sufficient', async () => {
      
        const semaphor = new Semaphor()
        const promsie = semaphor.signal('somethingElse', 'hi').toPromise()
        await expect(promsie).resolves.toEqual('hi')
    })

})