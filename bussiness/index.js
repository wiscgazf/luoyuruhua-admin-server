let objFun = {};
let fs = require('fs');
let moment = require('moment');
let md5 = require('../utils/md5');
let otherUtil = require('../utils/others');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db

objFun.indexSuc = function (req, res, next) {   // index page
    res.render('index', {title: '123'})
};

// ajax bussiness  -------------------------

objFun.loginAjax = function (req, res, next) {  // login ajax  bussiness
    let obj = {
        name: req.body.name,
        password: req.body.password
    };
    if (obj.name == '' || obj.password == '') {
        res.json({msg: '0'});
        return;
    }
    Admin.findOne({name: obj.name}).then(data => {
        if (!data) {
            res.json({msg: '2'});
        } else {
            if (obj.password == md5.aseDecode(data.password, data.name)) {
                return Admin.update({_id: data._id}, {$set: {loginTime: moment().format()}})
            } else {
                res.json({msg: '3'});
            }
        }
    }).then(data => {
        res.json({msg: '1', id: data._id, user: md5.aseEncode(obj.name, 'zhoufei')});
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
};


objFun.isLoginAjax = function (req, res, next) {    // isLogin ajax  bussiness
    let userName = md5.aseDecode(req.body.user, 'zhoufei');
    Admin.findOne({name: userName}, function (err, data) {
        if (err) {
            res.send(500);
            res.json({msg: '网络异常错误！'});
        } else if (!data) {
            res.json({msg: 0});
        } else {
            res.json({
                id: data._id,
                name: data.name,
                age: data.age,
                sex: data.sex,
                email: data.email,
                phone: data.phone,
                password: md5.aseDecode(data.password, data.name),
                userImg: data.userImg,
                loginTime: data.loginTime,
                msg: '1'
            });
        }
    });
};

objFun.getClientMsg = function (req, res, next) {   // getClientMsg ajax bussines
    Admin.findOne({name: md5.aseDecode(req.query.name, 'zhoufei')}, function (err, data) {
        if (err) {
            res.send(500);
            res.json({msg: '网络异常错误！'});
        } else if (!data) {
            res.json({msg: 0});
        } else {
            res.json({
                name: data.name,
                loginTime: data.loginTime,
                ip: otherUtil.getUserIp(req),
                msg: '1'
            });
        }
    });
}
module.exports = objFun;