#!/usr/bin/env node
var Table = require('cli-table')
// var Table = require('cli-table2')
var userHome = require('user-home')
var sep = require('path').sep
var args = process.argv.slice(2)
var isWin32 = process.platform === 'win32'
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
      var options = {
        head: ['pid', 'cwd', 'command'],
        // colWidths: [10, 24, 24]
        colWidths: [10, 26, 34],
      }
      // note: table display not right in window8 and linux #77
      // https://github.com/Automattic/cli-table/issues/77
      if (isWin32) {
        options.chars = {
            'top': ' '
          , 'top-mid': ' '
          , 'top-left': ' '
          , 'top-right': ' '
          , 'bottom': ' '
          , 'bottom-mid': ' '
          , 'bottom-left': ' '
          , 'bottom-right': ' '
          , 'left': ' '
          , 'left-mid': ' '
          , 'mid': ' '
          , 'mid-mid': ' '
          , 'right': ' '
          , 'right-mid': ' '
          , 'middle': ' '
        }
      }
      var table = new Table(options)
      table.push.apply(table, docs.map(function (doc) {
        return [
          doc.pid,
          // todo: cut the middle with `...` for readability
          (doc.opt.cwd + sep).replace(userHome + sep, '~' + sep),
          doc.cmd
        ]
      }))
      console.log(table.toString())
    })
  }
}
