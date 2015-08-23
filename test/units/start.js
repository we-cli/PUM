var PUM = require('../../').PUM
var request = require('supertest')
var _ = require('lodash')

describe('pum#start', function(){

  this.timeout(60000)

  var pum = new PUM()

  it('serve .', function (done){
    var prc = pum.start('serve . -p 3018')
    
    _.delay(function(){ // wait for ready
      request('http://localhost:3018')
        .get('/')
        .expect('content-type', /text/)
        .end(function(){
          pum.stop(prc.pid, done)
        })
    }, 3000)
  })

  it('node hello-world', function (done){
    var prc = pum.start('node ../fixtures/hello-server', {
      cwd: __dirname
    })

    _.delay(function(){ // wait for ready
      request('http://localhost:1337')
        .get('/')
        .expect(200, /hello wolrd/i)
        .end(function(){
          pum.stop(prc.pid, done)
        })
    }, 3000)
  })

})
