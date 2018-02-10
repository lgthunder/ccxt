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


async function getMyPosition() {
    let huobi = new trade();
    let result = await huobi.getMyPosition();
    console.log(result);

}
main();

