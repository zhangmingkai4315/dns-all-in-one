var NativeDNSPacket = require('native-dns-packet');
var UDPSocket=require('./UDPSocket').UDPSocket;
var util = require('util');

var Package=exports.Package=function (socket) {
  NativeDNSPacket.call(this);
  this._socket=socket;
  // this.address='undefined';
  // this.rawData=undefined;
};
util.inherits(Package,NativeDNSPacket);
Package.prototype.send=function () {
  var buff,len,size;
  if(typeof(this.edns_version)!=='undefined'){
    size=4096;
  }
  this.payload=size=size||this._socket.base_size;
  //清空一段buffer
  buff=this._socket.buffer(size);
  //将数据写入buffer 需要将对象传递进去
  len=NativeDNSPacket.write(buff,this);
  this._socket.send(len);
};
Package.prototype.getData=function (callback) {
  this._socket.on('message',callback);
};

Package.prototype.parse=function (msg) {
  var p=NativeDNSPacket.parse(msg);
  return p;
};

var main=function () {
  var req={
    question:{
      name:'www.baidu.com',
      type:'A',
      class:1
    },
    server:{
      address:'8.8.8.8',
      port:53,
      type:'udp',
      timeout:4000
    }
  };
  var socket=new UDPSocket();
  var p=new Package(socket.remote(req.server));
  p.header.id=Math.floor(Math.random()*60000+1);
  p.question.push(req.question);
  p.header.rd=1;
  p.send();

};
if(!module.parent){
  main();
}
