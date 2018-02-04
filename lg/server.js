//依赖一个http模块，相当于java中的import，与C#中的using
var http = require('http');

//创建一个服务器对象
server = http.createServer(function (req, res) {
//设置请求成功时响应头部的MIME为纯文本
    res.writeHeader(200, {"Content-Type": "text/plain"});
//向客户端输出字符
    res.end("Hello World\n");
});

server.listen(8191,'127.0.0.1');
console.log("server is runing at 127.0.0.1:8191");