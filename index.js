#!/usr/bin/env node
var minimist = require('minimist')
var WS = require('ws')
var split = require('split2')

var args = minimist(process.argv.slice(2))
var key = args._[0]

if (key) parse(key)
else listen()

function parse (key) {
    process.stdin
        .pipe(split())
        .on('data', function (line) {
            var str = line.toString()
            if (!str) return
            var row = JSON.parse(str)
            if (row[0] === key) console.log(row[1])
        })
}

function listen () {
    var wsServer = new WS.Server({ port: 8123 })
    wsServer.on('connection', function (socket) {
        socket.on('message', function (msg) {
            console.log(msg)
        })

        // process.on('SIGINT', function () {
        //     wsServer.close()
        // })

        socket.on('close', function () {
            wsServer.close()
        })
    })
}

