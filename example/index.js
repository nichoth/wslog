var Client = require('../client')

var send = Client()

send('foo', { hello: 'world' })
send.event({ hello: 'again' })
send.state({ someData: '' })

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
