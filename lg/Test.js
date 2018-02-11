"use strict";
const trade = require('../examples/js/trade.js');

// let re = process.argv.splice(2);
// console.log(re);
// getAccount();
// test();
async function test() {
    let start = new Date().getTime();
    let huobi = new trade();
    let result = await  huobi.getKline('ETC/USDT', '4hour', 3);
    console.log(result);

};


async function getAccount() {

    let huobi = new trade();
    let position = await huobi.getMyPosition();
    // console.log(position);
    // let re = await huobi.fetchBalance();
    // let coinArry = re.info.data.list;
    // for (let index in coinArry) {
    //     let coin = coinArry[index];
    //     if (coin.balance > 0.01) {
    //         console.log(coin);
    //     }
    // }
}

let http = require('http')
let opt = {
    method: 'GET',//这里是发送的方法
    headers: {
        //这里放期望发送出去的请求头
    }
}
//以下是接受数据的代码
var body = '';
var req = http.request(opt, function (res) {
    console.log("Got response: " + res.statusCode);
    res.on('data', function (d) {
        body += d;
    }).on('end', function () {
        console.log(res.headers)
        console.log(body)
    });

}).on('error', function (e) {
    console.log("Got error: " + e.message);
})
req.end();