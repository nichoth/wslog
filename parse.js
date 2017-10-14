var fs = require('fs')
var split = require('split2')
function noop () {}

function parse (path, cb) {
    var obj = {}

    fs.createReadStream(path)
        .pipe(split())
        .on('data', function (line) {
            if (!line) return
            var ev = JSON.parse(line)
            if (obj[ev[0]]) return obj[ev[0]].push(ev[1])
            obj[ev[0]] = [ev[1]]
        })
        .on('end', function () {
            cb(null, obj)
        })
}

function deserialize (_ev) {
    return _ev._dom ? {
        preventDefault: noop,
        target: _ev[1].target,
        type: _ev[1].type
    } :
    _ev
}

parse.deserialize = deserialize
module.exports = parse

