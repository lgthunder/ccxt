"use strict";
const trade = require('../examples/js/trade.js');

let re = process.argv.splice(2);
console.log(re);
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