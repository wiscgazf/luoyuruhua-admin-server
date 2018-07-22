let config = require('config');
let mongoose = require('mongoose');

let zhoufeiMongoose = mongoose.createConnection('mongodb://' + config.host + ':' + config.dbPort + '/' + 'luoyuruhua', {useNewUrlParser: true});


/**
 * 连接成功
 */
zhoufeiMongoose.on('connected', function () {
    console.log('zhoufeiMongoose --> 数据库连接成功');
});

/**
 * 连接异常
 */
zhoufeiMongoose.on('error', function (err) {
    console.log('user --> 数据库连接出现错误，错误为：' + err);
});

/**
 * 连接断开
 */

zhoufeiMongoose.on('disconnected', function () {
    console.log('goods --> 数据库连接断开');
});
module.exports = {
    zhoufeiMongoose: zhoufeiMongoose,
};