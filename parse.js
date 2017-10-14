var fs = require('fs')
var split = require('split2')
function noop () {}

function parse (path, cb) {
    var obj = {}

    fs.createReadStream(path)
        .pipe(split())
        .on('data', function (line) {
            if (!line) return
            var _ev = JSON.parse(line)
            var ev = _ev[1]._dom ?  [_ev[0], {
                preventDefault: noop,
                target: _ev[1].target,
                type: _ev[1].type
            }] :
            _ev

            if (obj[ev[0]]) return obj[ev[0]].push(ev[1])
            obj[ev[0]] = [ev[1]]
        })
        .on('end', function () {
            cb(null, obj)
        })
}

module.exports = parse

