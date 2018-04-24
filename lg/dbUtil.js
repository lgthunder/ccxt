"use strict";
// 引入redis包
const redis = require('redis');
const config = require('../examples/js/exchange_config')

module.exports = class dbUtill {
    constructor() {
        this.db_config = new config();
        this.client = redis.createClient(this.db_config.db_port, this.db_config.db_ip, {});
    }

    connect() {
        let c = this.client;
        this.client.auth(this.db_config.db_psd, function () {
            // console.log("pass")
        })
        // 连接提示
        this.client.on("connect", function (error) {
            // console.log("connect....");
        });
        // redis 链接错误提示；
        this.client.on("error", function (error) {
            console.log(error);
        });
        // this.client.set("domain", "coder10", function (err, res) {
        //     c.end(true);
        // });

        // this.client.get('domain', function (err, res) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(res);
        //     }
        //     c.end(false);
        // })
    }

    saveObj(key, value) {
        let c = this.client;
        this.client.set(key, JSON.stringify(value), function (err, res) {
            c.end(false);
        });
    }

    getObj(key, callBack) {
        let c = this.client;
        this.client.get(key, function (err, res) {
            console.log(err)
            callBack(JSON.parse(res));
            c.end(false);
        })
    }
}

// 创建客户端；
//var client = redis.createClient();  //默认使用端口：6379，IP：127.0.0.1


// redis的基本命令，设置key:value
// client.set("domain", "微信公众coder10", redis.print);
//
// // 根据key 获取 value
// client.get('domain', function (error, res) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(res);
//     }
//
//     // 关闭链接
//     client.end();
// });
//
//
// /**
//  * *设置 key - value
//  **/
// client.set("domain", "coder10");
// client.set("domain", "coder10", redis.print);
// // 根据key 获取 value
// client.get('domain', function (error, res) {
//     console.log(res);
// });
//
//
// /**
//  **设置hash值
//  **第一个参数是key，后面的参数是成对出现，可以有多对，对应的是filed value
//  **/
// // key = frameworks； field value [field1 value1 field2 valuew]
// client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
// // 获取值
// client.hgetall('frameworks', function (err, res) {
//     //结果：{ javascript: 'AngularJS', css: 'Bootstrap', node: 'Express' }
//     console.log(res);
// });
//
// // 也可以使用这种方式
// client.hmset('frameworks', {
//     'javascript': 'AngularJS',
//     'css': 'Bootstrap',
//     'node': 'Express'
// });
// // 获取值
// client.hgetall('frameworks', function (err, res) {
//     //结果：{ javascript: 'AngularJS', css: 'Bootstrap', node: 'Express' }
//     console.log(res);
// });
//
//
// /**
//  **保存set集合
//  **sadd会将列表的第一个元素作为key，其他的作为value保存
//  **/
// client.sadd(['myset', 'angularjs', 'backbonejs', 'emberjs'], function (err, reply) {
//     console.log(reply); // 3
// });
//
// // 获取 set
// client.smembers('myset', function (err, res) {
//     console.log(res);
// });
//
//
// /**
//  **判断key是否存在
//  **/
// client.exists('key', function (err, res) {
//     if (res === 1) { // 存在
//         console.log('exists');
//     } else {
//         console.log('doesn\'t exist');
//     }
// });
//
//
// /**
//  ** 删除key
//  **/
// client.del('frameworks', function (err, res) {
//     //删除成功返回 1
//     console.log(res);
// });
//
//
// /**
//  ** 设置key过期时间
//  **/
// client.set('key1', 'val1');
// client.expire('key1', 30);//30 秒
//
//
// /**
//  ** 自增1和自减1
//  **/
// client.set('key2', 10);
// //增加1
// client.incr('key2', function (err, res) {
//     console.log(res); // 11
// });
// //减去1
// client.decr('key2', function (err, res) {
//     console.log(res); // 10
// });
// //增加5
// client.incrby('key2', 5, function (err, res) {
//     console.log(res); // 15
// });
// //减去10
// client.decrby('key2', 10, function (err, res) {
//     console.log(res); // 5
// });

