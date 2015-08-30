var spawn = require('child_process').spawn
//var spawn = require('cross-spawn-async').spawn
//var parse = require('cross-spawn-async/lib/parse')
var sq = require('shell-quote')
var _ = require('lodash')
var resolve = require('path').resolve

var userHome = require('user-home')
var Datastore = require('nedb')
var db = {}
db.prcs = new Datastore(resolve(userHome, '.pum/prcs.db'))
db.prcs.loadDatabase()

// note: need js compile, also PR
//var ptree = require('process-tree')
var tkill = require('tree-kill')

var isWin = process.platform === 'win32'

module.exports = PUM
module.exports.PUM = PUM

function PUM(){
  // todo options
}


PUM.prototype.start = function(cmd, opt){
  opt = opt || {}
  opt = _.defaults(opt, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  })

  // $ pum start "serve . -p 3020"
  // also $ pum start serve . -p 3020
  if (_.isArray(cmd)) {
    cmd = sq.quote(cmd)
  } else {
    cmd = sq.quote(sq.parse(cmd))
  }
  //cmd = '"' + cmd + '"'

  //var prc = spawn('cmd.exe', ['/s', '/c', cmd], opt)
  // https://github.com/marklagendijk/node-pm2-windows-startup/blob/master/index.js
  var vbs = resolve(__dirname, '../bin/invisible.vbs')

  if (isWin) {
    var prc = spawn('wscript', [vbs, cmd], opt)
  } else {
    var prc = spawn('sh', ['-c', cmd], opt)
  }

  var title = opt.title || cmd
  prc.title = 'pum-- ' + title

  var doc = {
    cmd: cmd,
    opt: opt,
    pid: prc.pid
  }
  db.prcs.insert(doc)

  prc.unref()
  console.log('Starting %d: $ %s', prc.pid, cmd)
  return prc
}

PUM.prototype.restart = function (pid, cb) {
  var pum = this
  pum.stop(pid, function (err, doc) {
    if (err) {
      return cb(err)
    }
    pum.start(doc.cmd, doc.opt)
    cb(null)
  })
}

PUM.prototype.stop = function(pid, cb){
  console.log('Stopping %d', pid)
  //killProcess(pid, cb)
  tkill(pid, 'SIGINT', function (err) { // [1]signal required
    if (err) {
      return cb(err)
    }

    db.prcs.findOne({ pid: pid }, function (err, doc) {
      if (err) {
        return cb(err)
      }
      db.prcs.remove({ pid: pid }, function (err) {
        cb(err, doc)
      })
    })
  })
}

/*function killProcess(pid, cb){
  // nested children, two level only
  ptree(pid, function (err, children){
    if (err) {
      return cb(err)
    }
    try {
      children.forEach(function (child){
        // one more level
        child.children.forEach(function(ch){
          process.kill(ch.pid)
        })
        process.kill(child.pid)
      })
      process.kill(pid)
      cb(null)
    } catch(err) {
      cb(err)
    }
  })
}*/


