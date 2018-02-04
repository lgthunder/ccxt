"use strict";
var Rx = require('rxjs/Rx');
const huobitrade1 = require('./huobitrade.js');
const biantrade = require('./biantrade.js')
const tradeConfig = require('./trade_config');


module.exports = class huobitrade {
    constructor() {
        this.huobi = new huobitrade1();
        this.bian = new biantrade();
        this.config = new tradeConfig();
    }

// async function start() {
//     let flag = true;
//     huobi = new huobitrade1();
//     bian = new biantrade();
//     config = new tradeConfig();
//     let array = await fetchUsdtSymbol();
//     for (let index in array) {
//         let ma5 = await getMa5(array[index]);
//         let percent = (ma5.ma5 - ma5.current) / ma5.current * 100;
//         console.log(array[index] + " : " + percent.toFixed(2) + "  current : " + ma5.current.toFixed(4))
//
//     }
// fetchTicker(config.symbol);
// rebound(config.symbol, 235)
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
// }


    fetchTicker(symbol) {
        let t = new Date().now();
        Promise.all([this.huobi.fetchTicker(symbol), this.bian.fetchTicker(symbol)]).then(function (result) {
            let huobiTicker = result[0];
            let bianTicker = result[1];
            let huobiPrice = huobiTicker.close;
            console.log('fetch huobi done ' + symbol + " : " + huobiPrice);
            console.log('-------------------------------------------------------------')
            let bianPrice = bianTicker.last;
            console.log('fetch bian done' + symbol + " : " + bianPrice);
            let diff = huobiPrice - bianPrice;
            let precent = diff / bianPrice * 100;
            console.log(precent + t);
            fetchTicker(symbol);
        }, function () {
            console.log("------err----")
            fetchTicker(symbol);
        })
    }

    async  rebound(symbol, resistance) {
        let result = await this.huobi.fetchTicker(symbol)
        let current = result.close;
        let percent = (resistance - current) / current * 100;
        console.log(percent);
    }

    /**
     * 获取usdt交易对
     * @returns {Array}
     */
    async  fetchUsdtSymbol() {
        let result = await this.huobi.loadMarkets();
        let usdtArray = new Array();
        let index = 0;
        for (let sy in result) {
            let symbol = result[sy].symbol;
            if (symbol.indexOf("USDT") > 0) {
                usdtArray[index] = symbol;
                index = index + 1;
            }
        }
        return usdtArray;
    }

    /**
     *获取ma5和当前价格
     * @param symbol
     * @returns {{ma5: number, current: *}}
     */
    async  getMa5(symbol) {
        let result = await this.huobi.fetchKline(symbol, '1day', 6);
        let amount = 0;
        let index = 0;
        let data = result["data"];
        let current = data[0].close;
        for (let day in data) {
            if (day == 0) continue;
            amount = amount + data[day].close;
            index = index + 1;
        }
        let ma5 = amount / index;
        return {ma5, current};
    }
}

