// Provides a quick, little nock for websocket testing

var ws = require('faye-websocket');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function FakeWebsocketClient(_url) {
  this._url = _url;
  this.__wrapped = true; // compat with shimmer

  // this is gross cause emit in ctor is not right
  if (!this.emit('open')) {
    var self = this;
    var openInt = setInterval(function() {
      if (self.emit('open')) {
        clearInterval(openInt);
      }
    }, 10);
  }
};

util.inherits(FakeWebsocketClient, EventEmitter);

FakeWebsocketClient.prototype.send = function(data) {
  var boundDataEmitter = function(data) {
    this.emit('data', {data:data});
  };
  this.emit('sent', data, boundDataEmitter.bind(this));
};

ws.Client = FakeWebsocketClient;

module.exports = ws;