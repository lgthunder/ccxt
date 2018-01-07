"use strict";

const huobitrade1 = require('./huobitrade.js');
const biantrade = require('./biantrade.js')

const symbol_btc2usdt = 'BTC/USDT';
const symbol_etc2btc = 'ETC/BTC';
const symbol_ltc2usdt = 'LTC/USDT';
const symbol_eth2usdt = 'ETH/USDT';
const symbol_etc2usdt = 'ETC/USDT';

let huobi = null;
let bian = null;
async function main() {
    let flag = true;
    huobi = new huobitrade1();
    bian = new biantrade();
    while (flag) {
        try {
            // await fetchTicker(symbol_btc2usdt)
            // await fetchTicker(symbol_ltc2usdt)
            await fetchTicker(symbol_eth2usdt)
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

