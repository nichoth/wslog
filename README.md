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

### serialize dom events

Pass the serialized event to `deserialize` on the server side.

```js
var serialize = require('@nichoth/wslog/client').serialize
var ev = serialize(domEvent)

// => {
//     _dom: true,
//     type: 'click',
//     target: {
//         value: ev.target.value,
//         elements: ev.target.elements ?
//             Object.keys(ev.target.elements).reduce(function (acc, k) {
//                 acc[k] = {
//                     value: ev.target.elements[k].value
//                 }
//                 return acc
//             }, {}) :
//             undefined
// }
```

### filter events by namespace:

```
$ cat example/output.json | wslog foo
{ hello: 'world' }

$ cat example/output.json | wslog event
{ hello: 'again' }

$ cat example/output.json | wslog state
{ someData: '' }
```



### parse event logs

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


### deserialize dom events

This will add mock functions on `preventDefault()`

```js
var parse = require('@nichoth/wslog/parse')

logs.event.map(function (ev) {
    return parse.deserialize(ev)
})

// [
//     { hello:'again' },
//     // dom events are deseriazed with the target's value
//     // and `.preventDefault` is a function that does nothing
//     {'type':'click','target':{'value':''}},  
//     {'type':'submit', 'target':{'elements': { 
//         '0':{'value':'test value'},
//         '1':{'value':''},
//         'hello':{'value':'test value'},
//         'testInput':{'value':'test value'}}}
//     }
// ]
```



