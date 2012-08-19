var request = require('supertest')
var app = require('../')
app.command = 'touch testing.js'

var assert = require('assert')
var fs = require('fs')

afterEach(function(done) {
  fs.unlink('/tmp/testing.js', function() {
    fs.unlink('./testing.js', function() {
      done()
    })
  })
})

it('decodes hashes to paths', function(done) {
  var hash = app.hashCwd()
  request(app)
  .post('/' + hash)
  .expect(200, done)
})

it('decodes other hashes to paths', function(done) {
  var hash = app.hashCwd('/tmp')
  request(app)
  .post('/' + hash)
  .expect(200, done)
})

it('404 for invalid hashes', function(done) {
  request(app)
  .post('/garbage')
  .expect(404, done)
})

it('runs commands at cwd', function(done) {
  var hash = app.hashCwd('/tmp')
  request(app)
  .post('/' + hash)
  .expect(200, function(err) {
    assert.ifError(err)
    fs.exists('/tmp/testing.js', function(exists) {
      assert.ok(exists)
      done()
    })
  })
})
