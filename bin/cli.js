#!/usr/bin/env node
var args = process.argv.slice(2)
var PUM = require('../').PUM
var pum = new PUM()

respond(args)

function respond(args){
  var action = args[0]
  var values = args.slice(1)

  if (action === 'start') {
    pum.start(values)
  }

  else if (action === 'stop') {
    var pid = parseInt(values[0])
    if (isNaN(pid)) {
      return console.error('Invalid PID')
    }
    pum.stop(pid, function(err){
      if (err) throw err
    })
  }

  else if (action === 'restart') {
    var pid = parseInt(values[0])
    if (isNaN(pid)) {
      return console.error('Invalid PID')
    }
    pum.restart(pid, function (err) {
      if (err) throw err
    })
  }
}
