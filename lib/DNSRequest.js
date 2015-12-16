var util = require('util');
var EventEmitter=require('events').EventEmitter;
var UDPSocket=require('./UDPSocket').UDPSocket;
var Package=require('./DNSQuery').Package;
var dgram=require('dgram');
var DNSRequest=function (Package,socket) {
  EventEmitter.call(this);
  this.Package=Package;
  this.socket=socket;
  this.socket.on('message',function (err,msg) {
    console.log(msg);
  });
};

util.inherits(DNSRequest,EventEmitter);
DNSRequest.prototype.send=function () {
  this.socket.send(Package);
  this.emit('SendRequest');
};
// DNSRequest.on('SendRequest',function () {
//   console.log("SendRequest finished!");
// });


if(!module.parent){

  var req={
    question:{
      name:'www.a.shifen.com',
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
  var Socket=new UDPSocket(dgram.createSocket('udp4'),req.server);
  var dnsPackage=new Package(Socket);
  dnsPackage.header.id=Math.floor(Math.random()*60000+1);
  dnsPackage.question.push(req.question);
  dnsPackage.header.rd=1;
  dnsPackage.send();
  dnsPackage.getData(function (msg) {
    console.log(new Buffer(msg));
    console.log(dnsPackage.parse(msg));
    dnsPackage._socket.close();
  });

}
