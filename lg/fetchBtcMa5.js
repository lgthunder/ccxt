"use strict";
const trade = require('../examples/js/trade.js');

btcTest();
async function test() {
    let huobi = new trade();
    let resp = await huobi.getOffsetMa5();
    for (let index in resp) {
        let ma5 = resp[index];
        console.log(ma5.symbol + " " + ma5.offset + "%  " + ma5.fallRate + "%  " + ma5.preMa5 + " " + ma5.ma5 + " " + ma5.price);
    }
    let duration = (new Date().getTime() - start) / 1000;
    console.log("耗时:" + duration + "s");
}

async function btcTest() {
    let start = new Date().getTime();
    let huobi = new trade();
    huobi.getOffsetBtcMa5(function (resp) {
        for (let index in resp) {
            let ma5 = resp[index];
            console.log(ma5.symbol + " " + ma5.offset + "%  " + ma5.fallRate + "%  " + ma5.preMa5 + " " + ma5.ma5 + " " + ma5.price);
        }
        let duration = (new Date().getTime() - start) / 1000;
        console.log("数据: " + resp.length + " 耗时:" + duration + "s");
    });
}