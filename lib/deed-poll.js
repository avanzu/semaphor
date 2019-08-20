const EventEmitter = require('events')
const Intent       = require('./intent')

class DeedPoll extends EventEmitter {
    signal( name, value ){
        const intent = Intent.of(value)
        this.emit(name, intent)
        return intent
    }
}

module.exports = DeedPoll