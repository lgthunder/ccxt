"use strict";
const trade = require('../examples/js/trade.js');
const Ma5View = require('./ui/Ma5View.js')
//依赖一个http模块，相当于java中的import，与C#中的using
var http = require('http');

//创建一个服务器对象
let huobi = new trade();
let server = http.createServer(async function (req, res) {
//设置请求成功时响应头部的MIME为纯文本
    res.writeHeader(200, {"Content-Type": "text/plain"});
//向客户端输出字符
    let resp = await huobi.getOffsetMa5();
    res.end(resp.toString());
});

server.listen(8191);
console.log("server is runing at 127.0.0.1:8191");
// test();
// let tr = new Ma5View("12", "12", "11");
// console.log(tr.render());
// test();
// testThread();

// async function testThread() {
//     let huobiTrade = new trade();
//     let p = [];
//     for (let i = 0; 100 > i; i++) {
//         let a = huobiTrade.fetchUsdtSymbol();
//         p.push(a);
//         a.then(function (result) {
//             console.log("finish" + i);
//         })
//     }
//     Promise.all(p).then(function (result) {
//         console.log(result);
//     })
// }


// async function offsetMa5Test() {
//     let huobiTrade = new trade();
//     let array = await huobiTrade.fetchUsdtSymbol();
//     let result = new Array();
//     let p = new Array();
//     for (let index in array) {
//         let ma = huobiTrade.getMa5(array[index]);
//         p[index] = ma;
//     }
//     Promise.all(p).then(function (result) {
//         console.log(result);
//     })
//     return
// }

