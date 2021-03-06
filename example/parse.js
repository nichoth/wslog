var parse = require('../parse')
var assert = require('assert')

parse(__dirname + '/dom-events.json', function (err, logs) {
    console.log('parsed', err, logs)
    assert.deepEqual(logs.foo, [{hello:'world'}] )
    assert.deepEqual(logs.state, [{someData: '' }] )

    var evs = logs.event.map(function (ev) {
        return parse.deserialize(ev)
    })

    evs.slice(1).forEach(function (ev) {
        assert(typeof ev.preventDefault === 'function')
    })

    assert.deepEqual(evs.map(function (ev) {
        delete ev.preventDefault
        return ev
    }), [
        { hello:'again' },
        {'type':'click','target':{'value':''}},
        {'type':'submit', 'target':{'elements': {
            '0':{'value':'test value'},
            '1':{'value':''},
            'hello':{'value':'test value'},
            'testInput':{'value':'test value'}}}
        }
    ])

})

