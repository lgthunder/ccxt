"use strict";
const trade = require('../examples/js/trade.js');
const Ma5View = require('./ui/Ma5View.js')
//依赖一个http模块，相当于java中的import，与C#中的using
var http = require('http');

//创建一个服务器对象
let server = http.createServer(async function (req, res) {
//设置请求成功时响应头部的MIME为纯文本
    res.writeHeader(200, {"Content-Type": "text/plain"});
//向客户端输出字符
    let resp = await offsetMa5();
    res.end(resp.toString());
});

// server.listen(8191);
console.log("server is runing at 127.0.0.1:8191");
// test();
// let tr = new Ma5View("12", "12", "11");
// console.log(tr.render());
test();

async function test() {
    let resp = await offsetMa5Test();
    resp = sorft(resp);
    console.log(resp);
}

function sorft(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (parseInt(arr[j].offset) < parseInt(arr[j + 1].offset)) {        // 相邻元素两两对比
                var temp = arr[j + 1];        // 元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

async function offsetMa5Test() {
    let huobiTrade = new trade();
    let array = await huobiTrade.fetchUsdtSymbol();
    let result = new Array();
    let p = new Array();
    for (let index in array) {
        let ma = huobiTrade.getMa5(array[index]);
        p[index] = ma;
    }
    Promise.all(p).then(function (result) {
        console.log(result);
    })
    return
}

async function offsetMa5() {
    let huobiTrade = new trade();
    let array = await huobiTrade.fetchUsdtSymbol();
    let result = new Array();
    for (let index in array) {
        let ma = await huobiTrade.getMa5(array[index]);
        let percent = (ma.ma5 - ma.current) / ma.current * 100;
        let symbol = array[index];
        let offset = percent.toFixed(2);
        let price = ma.current.toFixed(4)
        let ma5 = ma.ma5.toFixed(4);
        result[index] = {symbol, offset, ma5, price}
    }
    return result;

}