"use strict";
var Rx = require('rxjs/Rx');
const huobitrade1 = require('./huobitrade.js');
const biantrade = require('./biantrade.js')
const tradeConfig = require('./trade_config');


let huobi = null;
let bian = null;
let config = null;
let finish = true;
async function main() {
    let flag = true;
    huobi = new huobitrade1();
    bian = new biantrade();
    config = new tradeConfig();
    fetchTicker(config.symbol);
    // while (flag) {
    //     try {
    //         if (finish) {
    //             finish = false;
    //             fetchTicker(config.symbol);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
}


function fetchTicker(symbol) {
    Promise.all([huobi.fetchTicker(symbol), bian.fetchTicker(symbol)]).then(function (result) {
        let huobiTicker = result[0];
        let bianTicker = result[1];
        let huobiPrice = huobiTicker.close;
        console.log('fetch huobi done ' + symbol + " : " + huobiPrice);
        console.log('-------------------------------------------------------------')
        let bianPrice = bianTicker.last;
        console.log('fetch bian done' + symbol + " : " + bianPrice);
        let diff = huobiPrice - bianPrice;
        let precent = diff / bianPrice * 100;
        console.log(precent);
        fetchTicker(symbol);
    }, function () {
        console.log("------err----")
        fetchTicker(symbol);
    })
}


main()

