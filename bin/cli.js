#!/usr/bin/env node
var Table = require('cli-table')
var userHome = require('user-home')
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

  else if (action === 'list') {
    pum.list(function (err, docs) {
      if (err) throw err
      /*var output = docs.map(function (doc) {
        return [
          doc.pid, doc.cmd,
          doc.opt.cwd.replace(userHome + '/', '~/')
        ].join('\t\t')
      }).join('\n')
      console.log(output)*/
      var table = new Table({
        head: ['pid', 'command', 'cwd'],
        colWidths: [10, 24, 24]
      })
      table.push.apply(table, docs.map(function (doc) {
        return [
          doc.pid, doc.cmd,
          doc.opt.cwd.replace(userHome + '/', '~/')
        ]
      }))
      console.log(table.toString())
    })
  }
}
