const EventEmitter = require('events')
const DeedPoll = require('./deed-poll')
describe('DeedPoll', () => {

    it('should be an EventEmitter', () => {

        const deedPoll = new DeedPoll()
        expect(deedPoll).toBeInstanceOf(EventEmitter)
    })

    it('should signal intents', async () => {
      
        const deedPoll = new DeedPoll()
        deedPoll.on('something', intent => intent.map( x => x * 2 ))

        const promise = deedPoll.signal('something', 2).toPromise()
        await expect(promise).resolves.toEqual(4)
    })

    it('should be self sufficient', async () => {
      
        const deedPoll = new DeedPoll()
        const promsie = deedPoll.signal('somethingElse', 'hi').toPromise()
        await expect(promsie).resolves.toEqual('hi')
    })

})