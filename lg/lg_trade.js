"use strict";
const trade = require('../examples/js/trade.js');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const SYMBOL_BTC = 'BTC/USDT';
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
            case "fetchOrders":
                fetchOrders(re[1])
                break
            case "co":
                createMarginOrder(SYMBOL_BTC, 0.001, 6000);
                break;
            case "cancel_order":
                cancelOrder(re[1])
                break;
            case "give_order":
                console.log(re[1], re[2], re[3], re[4])
                let trade = calPosition(re[1], re[2], re[3], re[4]);
                rl.question('输入 《 yes 》 确认操作,开始挂单 ', (answer) => {
                    if (answer == 'yes') {
                        let promises = []
                        for (let index in trade) {
                            if (trade[index].amount == 0) {
                                continue;
                            }
                            let p = createMarginOrder(SYMBOL_BTC, trade[index].amount, trade[index].limit);
                            promises.push(p);
                        }
                        Promise.all(promises).then(function (array) {
                            console.log(array);
                        })
                    } else {
                        console.log(`取消操作`);
                    }
                    rl.close();
                });
                break;
            case "cancel_all":
                cancelAll();
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
    console.log(result);
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

async function fetchOrders(status) {
    let huobi = new trade();
    let result = await huobi.fetchAllOrders("BTC/USDT", status);
    let orders = [];
    for (let index in result) {
        let info = result[index];
        // let order = {
        //     id: info.id,
        //     time: info.datetime,
        //     type: info.type,
        //     symbol: info.symbol,
        //     side: info.side,
        //     price: info.price,O
        //     amount: info.amount,
        //     filled: info.filled,
        //     remaining: info.remaining,
        //     status: info.status
        // };
        orders.push(info);
        consoleOrder(info);
    }
    return orders;
}

async function cancelAll() {
    let orders = await fetchOrders(0);
    if (orders.length < 1) {
        console.log("当前没有激活的挂单")
        return;
    }
    let promises = []
    for (let index in orders) {
        let p = cancelOrder(orders[index].id)
        promises.push(p);
    }
    Promise.all(promises).then(function (array) {
        console.log(array)
        return
    }).catch(function (err) {
        console.log(err);
        return
    })

}

async function cancelOrder(id) {
    let huobi = new trade();
    let result = await huobi.cancelOrder(id);
    return result;
}
async function createMarginOrder(symbol, amount, price) {
    let huobi = new trade();
    return huobi.createMarginLimitBuyOrder(symbol, amount, price);
}


function consoleOrder(order) {
    if (order.type == 'limit') {
        console.log(
            "time: " + order.datetime
            + " id: " + order.id
            + " symbol: " + modifiedStr(order.info.symbol, 12)
            + " type: " + modifiedStr(order.type, 7)
            + " side: " + modifiedStr(order.side, 6)
            + " price: " + modifiedNum(order.price)
            + " amount: " + modifiedNum(order.amount)
            + " filled: " + modifiedNum(order.filled)
            + " remaining: " + modifiedNum(order.remaining)
            + " average: " + modifiedNum(order.average)
            + " cost: " + modifiedNum(order.cost)
            + " status " + modifiedStr(order.status, 7))
    } else {
        console.log(
            "time: " + order.datetime
            + " id: " + order.id
            + " symbol: " + modifiedStr(order.info.symbol, 12)
            + " type: " + modifiedStr(order.type, 7)
            + " side: " + modifiedStr(order.side, 6)
            + " price: " + modifiedNum(order.price)
            + " amount: " + modifiedNum(order.amount)
            + " filled: " + modifiedNum(order.filled)
            + " remaining: " + modifiedNum(order.remaining)
            + " average: " + modifiedNum(order.average)
            + " cost: " + modifiedNum(order.cost)
            + " status " + modifiedStr(order.status, 7))
    }
}

function modifiedNum(str) {
    let result = str + "";
    while (result.length < 10) {
        result = result + " ";
    }
    return result.substr(0, 9);
}

function modifiedStr(str, count) {
    let result = str + "";
    while (result.length < count) {
        result = result + " ";
    }
    return result.substr(0, count - 1);
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

function calPosition(start_price, end_price, dollar, piece) {
    let start = start_price;
    let money = dollar;
    let height = start_price - end_price;
    let pieces = piece;
    let unit = 0.001;
    let count = height / pieces;
    let degree = 2 * Math.PI / 360;
    let ration = 60 * degree;
    let tan = Math.tan(ration);

    let area = [];
    let total = 0;
    for (let index = 1; index <= count; index++) {
        let bottom = 2 * index * pieces / tan;
        let top = 2 * (index - 1) * pieces / tan;
        let squ = (bottom + top) * pieces / 2;
        area.push(squ);
        total = squ + total;
        // console.log(squ);
    }
    let cost = 0;
    let bag = [];
    for (let index in area) {
        // console.log(area[index] / total);
        bag.push(money * area[index] / total)
        cost = cost + money * area[index] / total;
    }
    // console.log("cost:" + cost);
    // console.log("total:" + count);

    let trade = [];
    let total_amount = 0;
    let remainder = 0;

    let total_cost = 0;
    for (let index in bag) {
        let cost = bag[index] + remainder;
        let price = start - index * pieces;
        let amount = cost / price;
        let temp = amount % unit;
        // console.log(amount)
        amount = amount - temp;
        remainder = cost - amount * price;
        total_amount = total_amount + amount;
        total_cost = total_cost + amount * price;
        trade.push({limit: price, amount: amount.toFixed(4), cost: (amount * price).toFixed(2)})
        // console.log({limit: price, amount: amount, cost: amount * price})
    }
    console.log(trade);
    console.log("count: " + trade.length);
    console.log("total_amount:" + total_amount.toFixed(4));
    console.log("total_cost:" + total_cost.toFixed(2));
    console.log("average : " + (total_cost / total_amount).toFixed(2));
    return trade;
}

