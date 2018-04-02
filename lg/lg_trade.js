"use strict";
const trade = require('../examples/js/trade.js');


function main() {
    let re = process.argv.splice(2);
    if (re.length > 0) {
        switch (re[0]) {
            case 'fetchMa5':
                fetchMa5();
                break;
            case 'position':
                getMyPosition();
                break;
            case "fetchBtcMa5":
                fetchBtcMa5();
                break;
            case "ht":
                htAmountMa();
                break;
            case "margin_btc":
                fetchMarginBTC()
                break;
            case "spot":
                fetchSpot()
                break;

        }
    }
}

async function fetchMa5() {
    let start = new Date().getTime();
    let huobi = new trade();
    huobi.getOffsetMa5(function (resp) {
        for (let index in resp) {
            let ma5 = resp[index];
            console.log(ma5.symbol + " " + ma5.offset + "%  " + ma5.fallRate + "%  " + ma5.preMa5 + " " + ma5.ma5 + " " + ma5.price);
        }
        let duration = (new Date().getTime() - start) / 1000;
        console.log("数据: " + resp.length + " 耗时:" + duration + "s");
    });
}

async function fetchBtcMa5() {
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

async function fetchAccount() {
    let huobi = new trade();
    let result = await huobi.getAccount();
    console.log(result);

}

async function fetchSpot() {
    fetchBalance(0)
}

async function fetchMarginBTC() {
    let result = await fetchBalance(1);
    console.log(result.info.data.list);
}

async function fetchBalance(position) {
    let huobi = new trade();
    return await huobi.fetchBalance(position);
}

async function getMyPosition() {
    let huobi = new trade();
    let result = await huobi.getMyPosition();
    console.log(result);

}

async function htAmountMa() {
    let huobi = new trade();
    // let position = await huobi.getMyPosition();
    let p = [];
    let p1 = huobi.getMarketChangeRate('HT/USDT', 300000000);
    p.push(p1);
    let p2 = huobi.getMarketChangeRate('HT/BTC', 300000000);
    p.push(p2);
    let p3 = huobi.getMarketChangeRate('HT/ETH', 300000000);
    p.push(p3);
    Promise.all(p).then(function (result) {
        let amount = 0;
        console.log("total : ")
        for (let index in result[0]) {
            let temp = parseFloat(result[0][index]) + parseFloat(result[1][index]) + parseFloat(result[2][index]);
            amount = amount + temp;
            console.log(temp.toFixed(2));
        }
        console.log(amount);
    })

    // console.log(result);

}
main();

