'use strict'

var encrypt = require('../').encrypt
var decrypt = require('../').decrypt
var hashCwd = require('../').hashCwd
var assert = require('assert')

it('can decrypt an encrypted message', function() {
  var token = '/usr/bin'
  var password = 'password'
  var encrypted = encrypt(token, password)
  assert.ok(encrypted != token)
  assert.strictEqual(token, decrypt(encrypted, password))
})

it('can decrypt a "complex" encrypted message', function() {
  var token = process.cwd()
  token = 'Users/secoif/sdf'
  var password = 'password'
  var encrypted = encrypt(token, password)
  assert.ok(encrypted != token)
  assert.strictEqual(token, decrypt(encrypted, password))
})

it('doesn\'t decrypt garbage messages', function() {
  var token = '/usr/bin'
  var password = 'password'
  var encrypted = encrypt(token, password)
  assert.throws(function() {
    decrypt('garbage', password)
  })
})

it('getCwdHash encodes cwd()', function() {
  assert.equal(process.cwd(), decrypt(decodeURIComponent(hashCwd()), 'keyboard cat'))
})

it('getCwdHash encodes passed in cwd()', function() {
  assert.equal('/tmp', decrypt(decodeURIComponent(hashCwd('/tmp')), 'keyboard cat'))
})
