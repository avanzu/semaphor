const Intent = require('./intent')

describe('Intent', () => {

    it('should be promiseable', async () => {

        expect.assertions(1)

        const promise = Intent.of('hi').toPromise()
        await expect(promise).resolves.toEqual('hi')

    })

    it('should be a functor', async () => {

        expect.assertions(1)
        const result = Intent.of(1).map( x => x +1 ).toPromise()
        await expect(result).resolves.toEqual(2)

    })

    it('should be a monad', async () => {
        expect.assertions(1)
        const result = Intent.of(1).chain(Intent.of).toPromise()
        await expect(result).resolves.toEqual(1)
    })

    it('should have a "bimap" function', async () => {
        expect.assertions(1)
        const result = Intent.rejected(1)
            .bimap(x => `rejected ${x}`, x => `resolved ${x}`)
            .toPromise()
            
        await expect(result).rejects.toEqual('rejected 1')
    })

    it('should have a "fold" function', async () => {
        expect.assertions(1)
        const result = Intent
            .of(1)
            .fold(x => `rejected ${x}`, x => `resolved ${x}`)
            .toPromise()
      
        await expect(result).resolves.toEqual('resolved 1')
    })

    it('should have a "cata" method', async () => {
        const Rejected = x => `rejected ${x}`
        const Resolved = x => `resolved ${x}`
      
        const goodOne = Intent.of(1).cata({Rejected, Resolved}).toPromise()
        const badOne = Intent.rejected(2).cata({Rejected, Resolved}).toPromise()

        await expect(goodOne).resolves.toEqual('resolved 1')
        await expect(badOne).resolves.toEqual('rejected 2')
    })

    it('should have a "swap" method', async () => {

        const badOne = Intent.of(1).swap().toPromise()
        const goodOne = Intent.rejected(2).swap().toPromise()

        await expect(badOne).rejects.toEqual(1)
        await expect(goodOne).resolves.toEqual(2)

    })

    it('should be an applicative', async () => {
        const promise = Intent.of(x => x * 2).ap(Intent.of(1)).toPromise()
        await expect(promise).resolves.toEqual(2)
    })

    it('should have a "rejectedMap" function', async () => {
        const promise = Intent.rejected(2).rejectedMap(x => x +1 ).toPromise()

        await expect(promise).rejects.toEqual(3)
    })

    it('should be a semigroup', async () => {

        const promise = Intent.of(1).concat(Intent.of(2)).toPromise()
        await expect(promise).resolves.toEqual(1)

    })

})