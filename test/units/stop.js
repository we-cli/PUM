var PUM = require('../../').PUM
var request = require('supertest')
var _ = require('lodash')
var assert = require('assert')

describe('pum#stop', function(){

  this.timeout(60000)

  var pum = new PUM()

  it('serve .', function (done){
    var prc = pum.start('serve . -p 3018')
    
    _.delay(function(){ // wait for ready
      request('http://localhost:3018')
        .get('/')
        .expect('content-type', /text/)
        .end(function(){
          pum.stop(prc.pid, function (err){
            if (err) {
              return done(err)
            }

            // expect [Error: read ECONNRESET]
            request('http://localhost:3018')
              .get('/')
              .end(function(err){
                assert.ifError(!err)
                done()
              })
          })
        })
    }, 3000)
  })

})
