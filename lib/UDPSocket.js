var dgram=require('dgram'),
    EventEmitter=require('events').EventEmitter,
    net=require('net'),
    util=require('util');

var UDPSocket=exports.UDPSocket=function (socket,remote) {
  //如果没有初始化参数，则默认使用udp 4 生成socket操作
  this._socket=socket||dgram.createSocket('udp4');
  this._socket.once('message',this.emit.bind(this,'message'));
  this._remote=remote;
  this._buff=undefined;
  this.base_size=512;
};


util.inherits(UDPSocket,EventEmitter);


//清空一段Buffer
UDPSocket.prototype.buffer=function (size) {
  this._buff=new Buffer(size);
  return this._buff;
};
//发送数据
UDPSocket.prototype.send=function (len) {
  var self=this;
  this._socket.send(this._buff,0,len,this._remote.port,this._remote.address,function (err,info) {
    if(err){
      console.log('Error info:'+err);
    }else{
      //显示发送的字节
      console.log('Send data length:'+info);
    }
  });
};
UDPSocket.prototype.close=function () {
  this._socket.close();
};
