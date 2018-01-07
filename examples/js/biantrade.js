"use strict";

const symbol_etc2usdt = 'ETC/BTC'
const ccxt = require('../../ccxt')


module.exports = class biantrade {
    constructor() {
        this.exchange = new ccxt.binance({
            apiKey: key,
            secret: secret,
            enableRateLimit: true,
        });
    }

    async fetchTicker(symbol) {
        return this.exchange.fetchTicker(symbol);
    }

}

async function test() {

    // let order = await exchange.fetchOrders("ETC/BTC");
    // console.log(order)
    // let markets = await exchange.loadMarkets();
    // for (let symbol in markets) {
    //     console.log(symbol)
    // }
    // let ticker = await  exchange.fetchTicker(symbol_etc2usdt);
    // console.log(ticker);
}


test()