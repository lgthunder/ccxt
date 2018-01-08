"use strict";
var Rx = require('rxjs/Rx');
const huobitrade1 = require('./huobitrade.js');
const biantrade = require('./biantrade.js')
const tradeConfig = require('./trade_config');


let huobi = null;
let bian = null;
let config = null;
async function main() {
    let flag = true;
    huobi = new huobitrade1();
    bian = new biantrade();
    config = new tradeConfig();
    Rx.Observable.of(1, 2, 3).subscribe(
        function (count) {
            console.log(count);
        }
    );
    while (flag) {
        try {
            await fetchTicker(config.symbol);
        } catch (e) {
            console.log(e);
        }
    }
}


async function fetchTicker(symbol) {
    let huobiTicker = await huobi.fetchTicker(symbol);
    let huobiPrice = huobiTicker.close;
    console.log('fetch huobi done ' + symbol + " : " + huobiPrice);
    console.log('-------------------------------------------------------------')
    let bianTicker = await bian.fetchTicker(symbol);
    let bianPrice = bianTicker.last;
    console.log('fetch bian done' + symbol + " : " + bianPrice);
    let diff = huobiPrice - bianPrice;
    let precent = diff / bianPrice * 100;
    console.log(precent);
}
main()

