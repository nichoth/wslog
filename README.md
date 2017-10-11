# wslog

## install

```
$ npm install @nichoth/wslog
```

## example

In a terminal do this:

```
$ wslog
```

And in a browser do this:

```js
var Client = require('../client')

var send = Client()

send('foo', { hello: 'world' })
send.event({ hello: 'again' })
send.state({ someData: '' })

// server side:
// ["foo",{"hello":"world"}]
// ["event",{"hello":"again"}]
// ["state",{"someData":""}]
```

Filter events by namespace:

```
$ cat example/output.json | wslog foo
{ hello: 'world' }

$ cat example/output.json | wslog event
{ hello: 'again' }

$ cat example/output.json | wslog state
{ someData: '' }
```



