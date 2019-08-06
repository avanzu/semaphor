const Task = require('data.task')

class Intent {
  
    constructor(computation) {
        this.task = new Task(computation)
    }
    
    static of(payload) {
        return new Intent((_, resolve) => resolve(payload))
    }

    static rejected(payload) {
        return new Intent((reject) => reject(payload))
    }

    toPromise(){
        return new Promise((resolve, reject) => this.task.fork(reject, resolve))
    }

    map(fn) {
        this.task = this.task.map(fn)
        return this
    }
    chain(fn){
        this.task = this.task.chain(fn)
        return this
    }
    fork(onRejected, onSuccess){
        return this.task.fork(onRejected, onSuccess)
    }
    fold(onRejected, onSuccess) {
        this.task = this.task.fold(onRejected, onSuccess)
        return this
    }
    bimap(onRejected, onSuccess){
        this.task = this.task.bimap(onRejected, onSuccess)
        return this
    }
    concat(intent){
        this.task = this.task.concat(intent.task)
        return this
    }
    cata(pattern) {
        this.task = this.task.cata(pattern)
        return this
    }
    swap() {
        this.task = this.task.swap()
        return this
    }
    ap(intent) {
        this.task = this.task.ap(intent.task)
        return this
    }
    rejectedMap(fn) {
        this.task = this.task.rejectedMap(fn)
        return this
    }
}



module.exports = Intent