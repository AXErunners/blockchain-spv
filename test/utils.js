var bitcore = require('bitcore-lib-axe')
var u = require('axe-util')
var reverse = require('buffer-reverse')
var assign = require('object-assign')
var params = require('webcoin-axe').blockchain

exports.blockFromObject = function (obj) {
  var block = new bitcore.BlockHeader(obj)
  return block
}

exports.createBlock = function (prev, nonce, bits, validProof) {
  var i = nonce || 0
  validProof = validProof == null ? true : validProof
  var header
  do {
    header = exports.blockFromObject({
      version: 1,
      prevHash: prev ? prev._getHash() : u.nullHash,
      merkleRoot: u.nullHash,
      time: prev ? (prev.time + 1) : Math.floor(Date.now() / 1000),
      bits: bits || (prev ? prev.bits : u.compressTarget(exports.maxTarget)),
      nonce: i++
    })
  } while (validProof !== exports.validProofOfWork(header))
  return header
}

exports.maxTarget = new Buffer('7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'hex')

exports.validProofOfWork = function (header) {
  var target = u.expandTarget(header.bits)
  var hash = reverse(header._getHash())
  return hash.compare(target) !== 1
}

exports.createBlock = function (prev, nonce, bits, validProof) {
  var i = nonce || 0
  validProof = validProof == null ? true : validProof
  var header
  do {
    header = exports.blockFromObject({
      version: 1,
      prevHash: prev ? prev._getHash() : u.nullHash,
      merkleRoot: u.nullHash,
      time: prev ? (prev.time + 1) : Math.floor(Date.now() / 1000),
      bits: bits || (prev ? prev.bits : u.compressTarget(exports.maxTarget)),
      nonce: i++
    })
  } while (validProof !== exports.validProofOfWork(header))
  return header
}

var defaultTestParams = {
  genesisHeader: {
    version: 1,
    prevHash: u.nullHash,
    merkleRoot: u.nullHash,
    time: Math.floor(Date.now() / 1000),
    bits: u.compressTarget(exports.maxTarget),
    nonce: 0
  },
  checkpoints: null
}

exports.createTestParams = function (opts) {
  return assign({}, params, defaultTestParams, opts)
}
