var DNSConst=exports.DNSConst={
  HEADER:{
    HEADER_QR:0,
    HEADER_OPCODE:0,
    HEADER_AA:0,
    HEADER_TC:0,
    HEADER_RD:1,
    HEADER_RA:0,
    HEADER_Z:0,
    HEADER_RCODE_NOERROR:0,       //正常
    HEADER_RCODE_FORMATERROR:1,   //格式错误
    HEADER_RCODE_SERVERFAIL:2,    //服务器失败
    HEADER_RCODE_NAMENOTFOUND:3,  //域名找不到
    HEADER_RCODE_NOTSUPPORT:4,    //不支持该查询
    HEADER_RCODE_REFUSED:5,        //拒绝查询
    HEADER_QUESTION_NUM:1,          //默认查询一个域名
    HEADER_ANSWER_NUM:0,            //响应消息的数目
    HEADER_NAMESERVER_NUM:0,        //权威记录中包含的域名NS记录数目
    HEADER_ADDITIONAL_RECODE_NUM:0, //额外的记录个数
  },
  QUESTION:{
    TYPE:{
      TYPE_A:1,
      TYPE_NS:2,
      TYPE_MD:3,
      TYPE_MF:4,
      TYPE_CNAME:5,
      TYPE_SOA:6,
      TYPE_MB:7,
      TYPE_NULL:10,
      TYPE_PTR:12,
      TYPE_HINFO:13,
      TYPE_MX:15,
      TYPE_TXT:16,
      TYPE_RP:17,
      TYPE_DS:43,
      TYPE_RRSIG:46,
      TYPE_DNSKEY:48,
      TYPE_NSEC3:50,
      TYPE_NSEC3_PARAM:51,
      TYPE_TLSA:52,
      TYPE_SPF:99,
      TYPE_TKEY:249,
      TYPE_TSIG:250,
      TYPE_IXFR:251,
      TYPE_AXFR:252,
      TYPE_ALL:255,
      TYPE_DNSSEC:32768,
      TYPE_DNSSEC_LOOKASIDE:32769
    },
    CLASS:{
      CLASS_RESERVED:0,
      CLASS_IN:1,
      CLASS_HESIOD:4,
      CLASS_CHAOS:3,
      CLASS_ANY:255
    }
  }
}
