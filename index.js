'use strict'

var express = require('express')
var app = express()
app.use(express.errorHandler())
app.use(express.logger())
var crypto = require('crypto')
var assert = require('assert')
var domain = require('domain')
var fs = require('fs')
var child_process = require('child_process')

app.get('/:hash', function(req, res, next) {
  if (!req.params.hash) {
    console.warn('missing hash', req.params.hash)
    return res.send(404)
  }
  var decryptionKey = process.env.WH_SECRET || 'keyboard cat'
  try {
    var dir = decrypt(req.params.hash, decryptionKey)
  } catch (err) {
    if (err+''.match(/DecipherFinal/)) {
      console.warn('could not decipher', req.params.hash)
      return res.send(404)
    } else {
      return next(err)
    }
  }
  fs.exists(dir, function(exists) {
    if (!exists) {
      console.warn('directory does not exist!', dir)
      return res.send(404)
    }
    console.info(dir)
    child_process.exec(module.exports.command, {
      cwd: dir
    }, function(err) {
      if (err) return next(err)
      res.send(200)
    })
  })
})

var getId = function() {
  os.hostname() + process.cwd()
}

module.exports = app

var ALGORITHM = 'cast5-cbc'
var FORMAT = 'base64'

var encrypt = module.exports.encrypt = function(id, password) {
  assert.ok(id)
  assert.ok(password)
  var projectCipher = crypto.createCipher(ALGORITHM, password)
  var final = projectCipher.update(id, 'utf8', FORMAT)
  final += projectCipher.final(FORMAT)
  return final
}

var decrypt = module.exports.decrypt = function(encrypted, password) {
  assert.ok(encrypted)
  assert.ok(password)
  var projectDecipher = crypto.createDecipher(ALGORITHM, password)
  var final = projectDecipher.update(encrypted, FORMAT, 'utf8')
  final += projectDecipher.final('utf8')
  return final
}

module.exports.hashCwd = function(cwd) {
  return encodeURIComponent(encrypt(cwd || process.cwd(),  process.env.WH_SECRET || 'keyboard cat'))
}

module.exports.command = './webhook'
