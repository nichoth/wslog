var URL = 'ws://localhost:8123'

function Client () {
    var isOpen = false
    var isClosed = false
    var buffer = []
    var socket = new window.WebSocket(URL)

    function push (name, data) {
        if (!isOpen && !isClosed) {
            return buffer.push(JSON.stringify([name, data]))
        }
        if (isOpen) socket.send(JSON.stringify([name, data]))
    }

    push.event = function (data) {
        return push('event', data)
    }

    push.state = function (data) {
        return push('state', data)
    }

    push.close = function () {
        socket.close()
    }

    socket.addEventListener('open', function (event) {
        isOpen = true
        var ev
        while (ev = buffer.shift()) {
            socket.send(ev)
        }
    })

    socket.addEventListener('error', function (err) {
        isClosed = true
        isOpen = false
    })

    socket.addEventListener('close', function () {
        isClosed = true
        isOpen = false
    })

    return push
}

module.exports = Client

