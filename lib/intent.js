const Task = require('data.task')

class Intent {
  
    constructor(payload) {
        this._task = Task.of(payload)
    }

    map(fn) {
        this._task = this._task.map(fn)
        return this
    }
    chain(fn){
        this._task = this._task.chain(fn)
        return this
    }
    fork(onRejected, onSuccess){
        return this._task.fork(onRejected, onSuccess)
    }
    fold(onRejected, onSuccess) {
        this._task = this._task.fold(onRejected, onSuccess)
        return this
    }
    bimap(onRejected, onSuccess){
        this._task = this._task.bimap(onRejected, onSuccess)
        return this
    }
    concat(task){
        this._task = this._task.concat(task)
        return this
    }
    cata(pattern) {
        this._task = this._task.cata(pattern)
        return this
    }
    swap() {
        this._task = this._task.swap()
        return this
    }
    ap(task) {
        this._task = this._task.ap(task)
        return this
    }
    rejectedMap(fn) {
        this._task = this._task.rejectedMap(fn)
        return this
    }
}

Intent.prototype.of = function _of(context) {
    return new Intent(context)
}
Intent.of = Intent.prototype.of

module.exports = Intent