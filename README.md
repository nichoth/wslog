# wslog

Log application events via websockets

## install

```
$ npm install @nichoth/wslog
```

## example

In a terminal do this:

```
$ wslog
```

And in a browser do this (the terminal process will exit when the client disconnects):

```js
var Client = require('../client')

var send = Client()

send('foo', { hello: 'world' })
send.event({ hello: 'again' })
send.state({ someData: '' })

// dom events are serialized
var form = document.querySelector('form')
form.addEventListener('submit', function (ev) {
    ev.preventDefault()
    console.log('submit', ev)
    send.event(ev)
})

var btn = document.querySelector('button')
btn.addEventListener('click', function (ev) {
    console.log('click', ev)
    send.event(ev)
})

// server side:
// ["foo",{"hello":"world"}]
// ["event",{"hello":"again"}]
// ["state",{"someData":""}]
// ["event",{"_dom":true,"type":"click","target":{"value":""}}]
// ["event",{"_dom":true,"type":"submit","target":{
//   "elements":{
//     "0":{"value":"test value"},
//     "1":{"value":""},
//     "hello":{"value":"test value"},
//     "testInput":{"value":"test value"}}}}]
```


--------------------------

Filter events by namespace:

```
$ cat example/output.json | wslog foo
{ hello: 'world' }

$ cat example/output.json | wslog event
{ hello: 'again' }

$ cat example/output.json | wslog state
{ someData: '' }
```

----------------------------------------------

Parse and deserialize json logs

```js
var parse = require('@nichoth/wslog/parse')
var assert = require('assert')

// return an object from event namespaces to event data
parse(__dirname + '/dom-events.json', function (err, logs) {
    console.log('parsed', err, logs)

    {
        foo: [{ hello: 'world' }],
        state: [{ someData: '' }],
        event: [
            { hello:'again' },
            // dom events are deseriazed with the target's value
            // and `.preventDefault` is a function that does nothing
            {'type':'click','target':{'value':''}},  
            {'type':'submit', 'target':{'elements': { 
                '0':{'value':'test value'},
                '1':{'value':''},
                'hello':{'value':'test value'},
                'testInput':{'value':'test value'}}}
            }
        ]
    }
})

```



