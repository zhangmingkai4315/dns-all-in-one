var dgram=require('dgram'),
    EventEmitter=require('events').EventEmitter,
    net=require('net'),
    util=require('util');

var UDPSocket=exports.UDPSocket=function (socket,remote) {
  this._socket=socket||dgram.createSocket('udp4');
  this._socket.on('ready',function () {
    console.log('Ready to process');
  });
  this._socket.on('message',function (message, remote) {
    // console.log(arguments);
     console.log(remote.address + ':' + remote.port +' - ' + message);
  });
  this._remote=remote;
  this._buff=undefined;
  this.base_size=512;
};


util.inherits(UDPSocket,EventEmitter);

UDPSocket.prototype.buffer=function (size) {
  this._buff=new Buffer(size);
  return this._buff;
};

UDPSocket.prototype.bind=function (type) {
  var self=this;
  if(this.bound){
    this.emit('ready');
  }else{
    this._socket=dgram.createSocket(type);
    this._socket.on('listening',function () {
      self.bound=true;

    if(self._socket.unref()){
      self.unref=function () {
        self._socket.unref();
      };
      self.ref=function () {
        self._socket.ref();
      };
    }
    self.emit('ready');
  });
  // this._socket.on('message',this.emit.bind(this,'message'));
  this._socket.on('close',function () {
    self.bound=false;
    self.emit('close');
  });
  this._socket.bind();
}
};

UDPSocket.prototype.send=function (len) {
  var self=this;
  this._socket.send(this._buff,0,len,this._remote.port,this._remote.address,function (err,info) {
    if(err){
      console.log('Error info'+err);
    }else{
      console.log('Info:'+info);
    }
    // self._socket.close();
  });
};

UDPSocket.prototype.remote=function (remote) {
  return new UDPSocket(this._socket,remote);
};
UDPSocket.prototype.close=function () {
  this._socket.close();
};

if(!module.parent){
  var u=new UDPSocket();

}
