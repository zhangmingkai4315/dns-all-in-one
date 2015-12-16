var DNSConst=require('./DNSConst').DNSConst;
var HEADER=DNSConst.HEADER;
var QUESTION=DNSConst.QUESTION;
var DNSQueryPacket=exports.DNSQueryPacket=function (domainName,type,server,port,rd) {
  this.buffer=new Buffer(512);
  this.buffer.fill(0);
  this.queryInfo={
      queryDomain:domainName,
      queryType:QUESTION.TYPE['TYPE_'+type.toUpperCase()]||QUESTION.TYPE.TYPE_A,
      queryServer:server||'8.8.8.8',
      queryPort:port||53,
      queryRD:rd||1
  };
  this.packet={
    header:{
      qr:HEADER.HEADER_QR,     //定义查询还是响应 ，定义0代表这是一个查询请求，等待响应的数据包位为qr=1
      opcode:HEADER.HEADER_OPCODE, //四位，区分不同的查询请求，0代表标准查询
      aa:HEADER.HEADER_AA,     //权威应答位 用来区分是否权威应答
      tc:HEADER.HEADER_TC,     //消息是否是截断处理的
      rd:this.queryInfo.queryRD||HEADER.HEADER_RD,     //是否期待一个递归查询 默认为1
      ra:HEADER.HEADER_RA,     //响应消息中设置表示服务器是否支持递归查询
      z:HEADER.HEADER_Z,      //四位，将来使用
      rcode:HEADER.HEADER_RCODE_NOERROR   //四位，rcode 响应位，0代表没有错误发生，1 代表格式错误，2 服务器错误 3  域名查询不到 4 域名服务器不支持查询 5 拒绝查询
    },
    body:{
      questions:[],
      answers:[],
      authorities:[],
      additionals:[],
      edns_options:[],
      payload:undefined
    }
   }
   var question={
         name:this.queryInfo.queryDomain,
         type:this.queryInfo.queryType,
         class:QUESTION.CLASS.CLASS_IN,
         TTL:0
   };
   this.packet.body.questions.push(question);
};
DNSQueryPacket.prototype.writeHeader=function (buffer,packet) {
  var id=Math.floor(Math.random()*65535);
  var header=packet.header,
      body=packet.body;
      buffer.writeUInt16BE(id&0xFFFF);  //ID 16位 保存了请求的id号
  var val=0;
      val+=(header.qr<<15)&0x8000;
      val+=(header.opcode<<11)&0x7800;
      val+=(header.aa<<10)&0x400;
      val+=(header.tc<<9)&0x200;
      val+=(header.rd<<8)&0x100;
      val+=(header.ra<<7)&0x80;
      val+=(header.z<<4)&0xE;
      val+=(header.rcode)&0xF;

      buffer.writeUInt16BE(val&0xFFFF,2);
      buffer.writeUInt16BE(body.questions.length&0xFFFF,4);  // 设置只发送一个查询请求 查询数量字段
      buffer.writeUInt16BE(body.answers.length&0xFFFF,6);
      buffer.writeUInt16BE(body.authorities.length&0xFFFF,8);
      buffer.writeUInt16BE(body.additionals.length&0xFFFF,10);

      return buffer;
};

DNSQueryPacket.prototype.writeQuestion=function(buff,question){
  var start=12;
  for(var i=0;i<question.length;i++){
    for(var subdomain of question[i].name.split('.')){
      if(subdomain!==''){
        var domainlength=subdomain.length;
        buff.writeUInt16BE(domainlength<<8&0xFFFF,start);
        start=start+1;
        buff.write(subdomain,start,domainlength,'ascii');
        start+=subdomain.length;
      }
    }
    buff.writeUInt16BE(0x00&0xFFFF,start);
    start=start+1
    buff.writeUInt16BE(question[i].type&0xFFFF,start);
    start=start+2
    buff.writeUInt16BE(question[i].class&0xFFFF,start);
  }

  return start+2;
};

DNSQueryPacket.prototype.create=function () {
  this.writeHeader(this.buffer,this.packet);
  var packetLength=this.writeQuestion(this.buffer,this.packet.body.questions);
  return {buffer:this.buffer,packetLength:packetLength}
}
DNSQueryPacket.prototype.printPacket=function () {
  console.dir(this.buffer);
};


if(!module.parent){
  var q=new DNSQueryPacket('www.northwestern.edu','a','8.8.8.8');
  var packet=q.create();
  var dgram = require('dgram');
  var client = dgram.createSocket("udp4");
  client.send(packet.buffer, 0, (packet.packetLength), 53, "1.2.4.8", function(err) {
    if(err){
      console.log(err);
    }
    client.once('message',function (message) {
      console.log(message);
    });
  });
}
