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

    async loadAccounts() {
        return await this.huobi.loadAccounts();

    }

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
     * 获取usdt交易对
     * @returns {Array} [{},...]
     */
    async  fetchUsdtSymbolObj() {
        let result = await this.huobi.loadMarkets();
        let usdtArray = new Array();
        let index = 0;
        for (let sy in result) {
            let symbol = result[sy].symbol;
            if (symbol.indexOf("USDT") > 0) {
                usdtArray[index] = result[sy];
                index = index + 1;
            }
        }
        return usdtArray;
    }

    /**
     *
     * @returns {Array} [BTC/USDT,...]
     */
    async fetchBtcSymbol() {
        let result = await this.huobi.loadMarkets();
        let btcArray = new Array();
        let index = 0;
        for (let sy in result) {
            let symbol = result[sy].symbol;
            if (symbol.indexOf("BTC") > 1) {
                btcArray[index] = symbol;
                index = index + 1;
            }
        }
        return btcArray;
    }

    /**
     *
     * @returns {Array} [{},...]
     */
    async fetchBtcSymbolObj() {
        let result = await this.huobi.loadMarkets();
        let btcArray = new Array();
        let index = 0;
        for (let sy in result) {
            let symbol = result[sy].symbol;
            if (symbol.indexOf("BTC") > 1) {
                btcArray[index] = result[sy];
                index = index + 1;
            }
        }
        return btcArray;
    }

    /**
     *获取ma5和当前价格
     * @param symbol
     * @returns {{ma5: number, current: *}}
     */
    async  getUsdtMa5(symbol, period) {
        let result = await this.huobi.fetchKline(symbol, '1day', period);
        let amount = 0;
        let index = 0;
        let data = result["data"];
        let current = data[0].close;
        for (let day in data) {
            if (day == 0) continue;
            amount = amount + data[day].close;
            index = index + 1;
        }
        let preMa5 = amount / index;
        //ma5
        amount = 0;
        for (let day in data) {
            if (day == index) break;
            amount = amount + data[day].close;
        }
        let ma5 = amount / index;
        return {preMa5, ma5, current};
    }


    async getOffsetBtcMa5(onNext) {
        let array = await this.fetchBtcSymbol();
        let btcMa5 = await this.getBtcMa5();
        let result = [];
        let p = [];
        for (let index in array) {
            try {
                // if (index > 5) break;
                p.push(this.getMa5(array[index], btcMa5))
            } catch (e) {
                console.log(e);
            }
        }
        let sorft = this.sorft;
        Promise.all(p).then(function (arr) {
            console.log(arr)
            for (let index in arr) {
                let ma = arr[index];
                if (!ma) continue
                let percent = (ma.ma5 - ma.current) / ma.current * 100;
                let symbol = array[index];
                let offset = percent.toFixed(2);
                let price = ma.current.toFixed(4)
                let ma5 = ma.ma5.toFixed(4);
                let preMa5 = ma.preMa5.toFixed(4);
                let fallRate = (((preMa5 / ma5) - 1) * 100).toFixed(2);
                result.push({symbol, offset, fallRate, preMa5, ma5, price});
            }
            onNext(sorft(result));
        })
    }


    async getBtcMa5() {
        let result = await this.huobi.fetchKline('BTC/USDT', '1day', 6);
        return result["data"];
    }

    /**
     * 以btc计价 ma5
     * @param symbol
     * @param btcMa5
     * @returns {{preMa5: number, ma5: number, current: number}}
     */
    async getMa5(symbol, btcMa5) {
        console.log("fetch :  " + symbol);
        try {
            let result = await this.huobi.fetchKline(symbol, '1day', 6);
            let amount = 0;
            let index = 0;
            let data = result["data"];
            let current = data[0].close * btcMa5[0].close;
            for (let day in data) {
                if (day == 0) continue;
                amount = amount + data[day].close * btcMa5[day].close;
                index = index + 1;
            }
            let preMa5 = amount / index;
            //ma5
            amount = 0;
            for (let day in data) {
                if (day == index) break;
                amount = amount + data[day].close * btcMa5[day].close;
            }
            let ma5 = amount / index;

            return {preMa5, ma5, current}
        } catch (e) {
            console.log(e);
        }


    }

    async  getOffsetMa5(onNext) {
        let array = await this.fetchUsdtSymbol();
        let p = [];
        let result = new Array();
        for (let index in array) {
            try {
                p.push(this.getUsdtMa5(array[index]), 5);
            } catch (e) {
                console.log(e);
            }
        }
        let sorft = this.sorft;
        Promise.all(p).then(function (arr) {
            for (let index in arr) {
                let ma = arr[index];
                if (!ma) continue
                let percent = (ma.ma5 - ma.current) / ma.current * 100;
                let symbol = array[index];
                let offset = percent.toFixed(2);
                let price = ma.current.toFixed(4)
                let ma5 = ma.ma5.toFixed(4);
                let preMa5 = ma.preMa5.toFixed(4);
                let fallRate = (((preMa5 / ma5) - 1) * 100).toFixed(2);
                result[index] = {symbol, offset, fallRate, preMa5, ma5, price}
            }
            result = sorft(result);
            onNext(result);
        })

        // return result;

    }

    async getMarketChangeRate(symbol, total) {
        let result = await this.huobi.fetchKline(symbol, '1day', 6);
        let amount = 0;
        let arr = [];
        console.log(symbol);
        let data = result["data"];
        for (let index in data) {
            let day = data[index];
            amount = amount + day.amount;
            console.log((day.amount / total).toFixed(2));
            arr.push((day.amount / total).toFixed(2))
        }
        return arr;
    }


    async getAccount() {
        return await this.huobi.fetchAccount();
    }

    async fetchBalance(position) {
        return await  this.huobi.fetchBalance(position);
    }

    async getKline(symbol, period, count) {
        let result = await this.huobi.fetchKline(symbol, period, count);
        return result;
    }

    async getMyPosition() {
        let symbolArr = await this.fetchUsdtSymbolObj();
        let re = await this.fetchBalance();
        let coinArry = re.info.data.list;
        for (let index in coinArry) {
            let coin = coinArry[index];
            if (coin.balance > 0.01) {
                if (coin.currency == 'usdt') {
                    console.log(coin.currency + " : " + coin.balance);
                    continue;
                }
                let symbol = this.findSymbol(coin.currency, symbolArr);
                if (symbol) {
                    let ticker = await this.huobi.fetchTicker(symbol);
                    let amount = coin.balance * ticker.close;
                    console.log(symbol + " : " + amount.toFixed(2));
                }
            }
        }
    }


    findSymbol(symbol, arr) {
        for (let index in arr) {
            let obj = arr[index];
            if (obj.id.indexOf(symbol) >= 0) {
                return obj.symbol;
            }
        }
        // return symbol;
    }


    sorft(arr) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (parseInt(arr[j].offset) < parseInt(arr[j + 1].offset)) {        // 相邻元素两两对比
                    var temp = arr[j + 1];        // 元素交换
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }


    async fetchTrend(period) {
        let array = await this.fetchUsdtSymbol();
        let p = [];
        let result = new Array();
        for (let index in array) {
            try {
                p.push(this.getUsdtMa((array[index]), period));
            } catch (e) {
                console.log(e);
            }
        }
        let sorft = this.sorftD;
        let modifiedStr = this.modifiedStr;
        let modifiedNum = this.modifiedNum;
        Promise.all(p).then(function (arr) {
            for (let index in arr) {
                let ma = arr[index];
                if (!ma) continue
                // let percent = (ma.ma5 - ma.current) / ma.current * 100;
                // let symbol = array[index];
                // let offset = percent.toFixed(2);
                // let price = ma.current.toFixed(4)
                // let ma5 = ma.ma5.toFixed(4);
                // let preMa5 = ma.preMa5.toFixed(4);
                // let fallRate = (((preMa5 / ma5) - 1) * 100).toFixed(2);
                // result[index] = {symbol, offset, fallRate, preMa5, ma5, price}
                result[index] = ma;
            }
            result = sorft(result);
            for (let index in result) {
                let re = result[index];
                let log = "" + "symbol:" + modifiedStr(re.symbol, 10)
                    + "  D:" + modifiedNum(re.D)
                    + "  offset:" + modifiedNum(re.offset)
                    + "  current:" + modifiedNum(re.current);
                for (let t in period) {
                    if (re["ma" + period[t]]) {
                        log = log + "  ma" + period[t] + ": " + modifiedNum(re["ma" + period[t]]);
                    }
                }
                console.log(log);
            }
        })
    }

    async  getUsdtMa(symbol, periods) {
        let result = await this.huobi.fetchKline(symbol, '1day', periods[periods.length]);
        let data = result["data"];
        let current = data[0].close;
        let response = new Array();
        response["symbol"] = symbol;
        response["current"] = current;
        let d = 0;
        let count = 0;
        let flag = 0
        for (let period in periods) {
            let total = 0;
            let day_count = 0;
            for (let day in data) {
                if (day > periods[period] - 1) break;
                total = total + data[day].close;
                day_count++;
            }
            let avg = total / day_count
            d = d + Math.pow(current - avg, 2);
            response["ma" + day_count] = avg;
            count++;
            if (current >= avg) {
                flag = 1;
            } else {
                flag = 0;
            }
        }
        let dx = Math.sqrt(d / count);
        if (flag == 1) {
            response["D"] = dx / current * 100;
        } else {
            response["D"] = (0 - dx / current) * 100;
        }
        let offset = (current - response["ma" + periods[0]]) / current * 100
        response["offset"] = offset;
        return response;
    }

    sorftD(arr) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (parseInt(arr[j].D) < parseInt(arr[j + 1].D)) {        // 相邻元素两两对比
                    var temp = arr[j + 1];        // 元素交换
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }

    modifiedNum(str) {
        let result = str + "";
        while (result.length < 9) {
            result = result + " ";
        }
        return result.substr(0, 8);
    }

    modifiedStr(str, count) {
        let result = str + "";
        while (result.length < count) {
            result = result + " ";
        }
        return result.substr(0, count - 1);
    }

    /**
     * 限价购买
     * @param symbol 交易对
     * @param amount
     * @param price
     */
    async  createLimitBuyOrder(symbol, amount, price, position) {
        return await this.huobi.createLimitBuyOrder(symbol, amount, price, position)
    }

    /**
     * 取消订单
     * @param id
     */
    async  cancelOrder(id) {
        return await this.huobi.cancelOrder(id)
    }

    /**
     * 根据id 获取订单详情
     * @param id
     */
    async  fetchOrderById(id) {
        return await this.huobi.fetchOrderById(id)
    }


    /**
     * 获取所有订单
     * @param symbol
     * @param status 0 open  1 closed
     */
    async  fetchAllOrders(symbol, status) {
        return await this.huobi.fetchAllOrders(symbol, status);
    }

    /**
     *  限价卖出
     * @param symbol 交易队 例如: 'ETC/USDT'
     * @param amount 数量
     * @param price  价格
     */
    async createLimitSellOrder(symbol, amount, price, position) {
        return await this.huobi.createLimitSellOrder(symbol, amount, price, position)
    }

    async createMarginLimitSellOrder(symbol, amount, price) {
        return await this.huobi.createLimitSellOrder(symbol, amount, price, 1)
    }

    async  createMarginLimitBuyOrder(symbol, amount, price) {
        return await this.huobi.createLimitBuyOrder(symbol, amount, price, 1)
    }

}

