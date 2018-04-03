"use strict";

const ccxt = require('../../ccxt')
const asTable = require('as-table')
const asciichart = require('asciichart')
const log = require('ololog')
const symbol_etc2usdt = 'ETC/USDT'
const symbol_etc2btc = 'ETC/BTC'
const huobi = require('./huobitrade.js')
var Rx = require('rxjs/Rx');


const exchangeConfig = require('./exchange_config');
const secret = require('./exchange_config').HUOBI_SECRET;
require('ansicolor').nice;

module.exports = class huobitrade {

    constructor() {
        let config = new exchangeConfig();
        this.exchange = new ccxt.huobipro({
            apiKey: config.HUOBI_KEY,
            secret: config.HUOBI_SECRECT,
            enableRateLimit: true
            // proxy: config.proxy,
        })
        this.exchange.loadAccounts();
    }


    /**
     *  限价卖出
     * @param symbol 交易队 例如: 'ETC/USDT'
     * @param amount 数量
     * @param price  价格
     */
    async createLimitSellOrder(symbol, amount, price, position) {
        return await this.exchange.createLimitSellOrder(symbol, amount, price, {index: position})
    }

    /**
     * 获取当前行情
     * @param symbol
     */
    async fetchTicker(symbol) {
        return await this.exchange.fetchTicker(symbol);
    }

    /**
     * 限价购买
     * @param symbol 交易对
     * @param amount
     * @param price
     */
    async  createLimitBuyOrder(symbol, amount, price, position) {
        return await this.exchange.createLimitBuyOrder(symbol, amount, price, {index: position})
    }

    /**
     * 取消订单
     * @param id
     */
    async  cancelOrder(id) {
        return await this.exchange.editOrder(id)
    }

    /**
     * 根据id 获取订单详情
     * @param id
     */
    async  fetchOrderById(id) {
        return await this.exchange.fetchOrder(id)
    }


    /**
     * 获取所有订单
     * @param symbol
     * @param status 0 open  1 closed
     */
    async  fetchAllOrders(symbol, status) {
        return await this.exchange.fetchOrders(symbol, '', '', {'status': status});
    }

    async fetchMarginOrders(symbol, status) {

        // return await this.exchange.fetchOrders(symbol, '', '', {'status': status,'id':this.exchange.});
    }


    async fetchKline(symbol, period, size) {
        return await this.exchange.fetchKline(symbol, period, size);
    }

    async loadMarkets() {
        return await this.exchange.loadMarkets();
    }

    async fetchAccount() {
        return await this.exchange.fetchAccounts();
    }

    async fetchBalance(position) {
        return await  this.exchange.fetchBalance({index: position});
    }

    async  fetchOhlcv() {
        let index = 4 // [ timestamp, open, high, low, close, volume ]
        let ohlcv = await this.exchange.fetchOHLCV('BTC/USDT', '30m')
        console.log(ohlcv)
        let lastPrice = ohlcv[ohlcv.length - 1][index] // closing price
        let series = ohlcv.slice(-80).map(x => x[index]) // closing price
        let bitcoinRate = ('₿ = $' + lastPrice).green
        let chart = asciichart.plot(series, {height: 15, padding: '            '})
        log.yellow("\n" + chart, bitcoinRate, "\n")
        process.exit()
    }
}


function main() {
    // console.log(ccxt.exchanges)
    // const orders = await exchange.loadMarkets ()
    // log (exchange.id.green, 'loaded', exchange.symbols.length.toString ().bright.green, 'symbols')
    // log (asTable (orders.map (order => ccxt.omit (order, [ 'timestamp', 'info' ]))))

    // const order = await exchange.fetchOrder (orders[0]['id'])
    //
    // log (order)
    // let kraken = new ccxt.kraken()
    // let markets = await kraken.load_markets()
    // console.log(kraken.id, markets['XLM/EUR'])
    // let kraken = new ccxt.kraken ({ verbose: true }) // log HTTP requests
    // await kraken.load_markets () // request markets
    // console.log (kraken.id, kraken.markets)    // output a full list of all loaded markets
    // console.log (Object.keys (kraken.markets)) // output a short list of market symbols
    // console.log (kraken.markets['BTC/USD'])    // output single market details
    // await kraken.load_markets () // return a locally cached version, no reload
    // let reloadedMarkets = await kraken.load_markets (true) // force HTTP reload = true
    // console.log (reloadedMarkets['ETH/BTC'])
    // let markets = await exchange.load_markets()
    // for (let symbol in markets) {
    //     console.log(symbol)
    // }
    // console.log(await exchange.fetchBalance())

    // fetchAllOrders(symbol_etc2usdt, '0')
    // createLimitSellOrder(symbol_etc2usdt, '0.01', '60')
    // createLimitBuyOrder(symbol_etc2usdt, '0.01', '10')
    // fetchOrderById('611719531')
    // cancelOrder('612567481')
    // let markets = await exchange.fetchMarkets();
    // console.log(markets);
    // fetchOhlcv()
    // fetchTickers(symbol_etc2btc);
    //  new huobitrade().fetchTickers(symbol_etc2btc);
}


main()
