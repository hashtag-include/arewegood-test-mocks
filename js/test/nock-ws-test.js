// Verify the integrity of node-ws.js

var assert = require('assert');
var ws = require('../nock-ws');

describe("nock-ws", function() {
  it("should return a nocked Client", function() {
    var sock = new ws.Client("ws://whatever");
    assert(sock.__wrapped, "sock doesn't have .__wrapped");
    assert(sock, "sock is of type"+typeof(sock));
  });

  it("should emit open", function(done) {
    var sock = new ws.Client("ws://whatever");
    sock.on('open', function() {
      done();
    });
  });

  it("should emit sent", function(done) {
    var sock = new ws.Client("ws://whatever");
    sock.on('sent', function(data, responder) {
      assert.deepEqual(data, {arbitrary:true});
      done();
    });
    sock.send({arbitrary:true});
  });

  it("should emit data, when responder called", function(done) {
    var sock = new ws.Client("ws://whatever");
    sock.on('sent', function(data, responder) {
      assert.deepEqual(data, {arbitrary:true});
      responder({moreso:false});
    });
    sock.on('data', function(event) {
      assert.deepEqual(event.data, {moreso:false});
      done();
    });
    sock.send({arbitrary:true});
  });
});