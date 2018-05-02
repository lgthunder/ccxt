"use strict";
const trade = require('../examples/js/trade.js');
const readline = require('readline');
const SYMBOL_BTC = 'BTC/USDT';
const dbUtill = require('./dbUtil')
async function main() {
    // let db = new dbUtill();
    // db.connect(new function () {
    //     // db.close();
    //     console.log("call");
    //     // db.close()
    // });
    let re = process.argv.splice(2);
    if (re.length > 0) {
        let huobi = new trade();
        await huobi.loadAccounts();
        switch (re[0]) {
            case 'fetchMa5':
                fetchMa5();
                break;
            case 'position':
                if (re[1]) {
                    getMyPosition(re[1]);
                } else {
                    getMyPosition();
                }
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
                let p = createMarginLimitSellOrder(huobi, SYMBOL_BTC, 0.001, 8000);
                p.then(function (resp) {
                    console.log(resp);
                }).catch(function (err) {
                    console.log(err);
                })
                break;
            case "cancel_order":
                cancelOrder(huobi, re[1])
                break;
            case "limit_buy_list":
                console.log(re[1], re[2], re[3], re[4])
                let buyTrades = increasePosition(re[1], re[2], re[3], re[4]);
                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question('输入 《 yes 》 确认操作,开始挂单 ', (answer) => {
                    if (answer == 'yes') {
                        let promises = []
                        for (let index in buyTrades) {
                            if (buyTrades[index].amount == 0) {
                                continue;
                            }
                            let p = createMarginBuyOrder(huobi, SYMBOL_BTC, buyTrades[index].amount, buyTrades[index].limit);
                            promises.push(p);
                        }
                        Promise.all(promises).then(function (array) {
                            console.log(array);
                        }).catch(function (err) {
                            console.log(err);
                        })
                    } else {
                        console.log(`取消操作`);
                    }
                    rl.close();
                });
                break;
            case "limit_sell_list":
                let sellTrades = descendingPosition(re[1], re[2], re[3], re[4]);
                createLimitSellList(huobi, sellTrades);
                break;
            case "cancel_all":
                cancelAll(re[1]);
                break;
            case "fetch_trend":
                let arry = [];
                for (let index in re) {
                    if (index == 0) continue;
                    arry.push(re[index]);
                }
                fetchTrend(arry);
                break;
            case "fetch_hadax":
                fetchBalance(re[1]).then(function (result) {
                    console.log(result);
                });
                break;
            case "test":
                break;
            case "margin":
                for (let index = 0; index < 100; index++) {
                    console.log(index);
                    await marginOrder(huobi, 'adausdt', 'usdt', 100);
                }
                break;
        }
    }
}

function createLimitSellList(huobi, sellTrades) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('输入 《 yes 》 确认操作,开始挂单 ', (answer) => {
        if (answer == 'yes') {
            let promises = []
            for (let index in sellTrades) {
                if (sellTrades[index].amount == 0) {
                    continue;
                }
                let p = createMarginLimitSellOrder(huobi, SYMBOL_BTC, sellTrades[index].amount, sellTrades[index].limit);
                promises.push(p);
            }
            Promise.all(promises).then(function (array) {
                console.log(array);
            }).catch(function (err) {
                console.log(err);
            })
        } else {
            console.log(`取消操作`);
        }
        rl.close();
    });

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

async function getMyPosition(params) {
    let huobi = new trade();
    let result = await huobi.getMyPosition(params);
    // console.log(result);
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

async function cancelAll(params) {
    let orders = await fetchOrders(0);
    if (orders.length < 1) {
        console.log("当前没有激活的挂单")
        return;
    }
    let promises = []
    let huobi = new trade();
    for (let index in orders) {
        let p;
        switch (params) {
            case 'f':
                p = cancelOrder(huobi, orders[index].id)
                break
            case 's':
                if (orders[index].side == 'sell') {
                    p = cancelOrder(huobi, orders[index].id)
                }
                break
            case 'b':
                if (orders[index].side == 'buy') {
                    p = cancelOrder(huobi, orders[index].id)
                }
                break
            default:
                console.log("需要一个额外参数  f, s, b ")
                break

        }
        if (p) {
            promises.push(p);
        }
    }
    if (promises.length < 1) {
        return
    }
    Promise.all(promises).then(function (array) {
        console.log(array)
        return
    }).catch(function (err) {
        console.log(err);
        return
    })

}

async function cancelOrder(huobi, id) {
    let result = await huobi.cancelOrder(id);
    return result;
}
async function createMarginBuyOrder(huobi, symbol, amount, price) {
    return await huobi.createMarginLimitBuyOrder(symbol, amount, price);
}

async function createMarginLimitSellOrder(huobi, symbol, amount, price) {
    return await huobi.createMarginLimitSellOrder(symbol, amount, price);
}


function consoleOrder(order) {
    if (order.type == 'limit') {
        console.log(
            "time: " + order.datetime
            + " id: " + order.id
            + " symbol: " + modifiedStr(order.info.symbol, 10)
            + " type: " + modifiedStr(order.type, 6)
            + " side: " + modifiedStr(order.side, 6)
            + " price: " + modifiedNum(order.price)
            + " amount: " + modifiedNum(order.amount)
            + " filled: " + modifiedNum(order.filled)
            + " remaining: " + modifiedNum(order.remaining)
            + " average: " + modifiedNum(order.average)
            + " cost: " + modifiedNum(order.cost)
            + " status " + modifiedStr(order.status, 6))
    } else {
        console.log(
            "time: " + order.datetime
            + " id: " + order.id
            + " symbol: " + modifiedStr(order.info.symbol, 10)
            + " type: " + modifiedStr(order.type, 6)
            + " side: " + modifiedStr(order.side, 6)
            + " price: " + modifiedNum(order.price)
            + " amount: " + modifiedNum(order.amount)
            + " filled: " + modifiedNum(order.filled)
            + " remaining: " + modifiedNum(order.remaining)
            + " average: " + modifiedNum(order.average)
            + " cost: " + modifiedNum(order.cost)
            + " status " + modifiedStr(order.status, 6))
    }
}

function modifiedNum(str) {
    let result = str + "";
    while (result.length < 9) {
        result = result + " ";
    }
    return result.substr(0, 8);
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

function descendingPosition(start_price, end_price, dollar, piece) {
    let start = start_price;
    let money = dollar;
    let height = end_price - start_price;
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
    }
    console.log(area);

    let bag = [];
    for (let index in area) {
        bag.push(money * area[index] / total);
    }

    // console.log(bag);

    let trade = [];
    let total_amount = 0;
    let remainder = 0;
    let total_gain = 0;
    for (let index in bag) {
        let limit = parseFloat(start_price) + index * piece;
        let amount = bag[index] + remainder;
        let temp = amount % unit;
        amount = amount - temp;
        remainder = temp;
        let gain = amount * limit;
        total_amount = total_amount + amount;
        total_gain = total_gain + gain;
        trade.push({limit: limit.toFixed(1), amount: amount.toFixed(4), gain: gain.toFixed(2)})

    }

    console.log(trade);
    console.log("count: " + trade.length);
    console.log("total_amount: " + total_amount.toFixed(4));
    console.log("total_gain: " + total_gain.toFixed(2));
    console.log("average : " + (total_gain / total_amount).toFixed(2));
    return trade;

}


function increasePosition(start_price, end_price, dollar, piece) {
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
    console.log("total_amount: " + total_amount.toFixed(4));
    console.log("total_cost:" + total_cost.toFixed(2));
    console.log("average : " + (total_cost / total_amount).toFixed(2));
    return trade;
}

function fetchTrend(params) {
    console.log(params);
    let huobi = new trade();
    huobi.fetchTrend(params);
}
async function marginOrder(huobi, symbol, currency, amount) {
    let resp = await huobi.createMarginOrder(symbol, currency, amount);
    console.log(resp);
}

