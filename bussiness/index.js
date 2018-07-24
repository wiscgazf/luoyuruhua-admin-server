let objFun = {};
let fs = require('fs');
let moment = require('moment');
let md5 = require('../utils/md5');

// admin db
let Admin = require('../models/Admin');

// index page
objFun.indexSuc = function (req, res, next) {
    res.render('index', {title: '123'})
};

// ajax bussiness  -------------------------

// login  bussiness
objFun.loginAjax = function (req, res, next) {
    let obj = {
        name: req.body.name,
        password: req.body.password
    };
    if (obj.name == '' || obj.password == '') {
        res.json({msg: '0'});
        return;
    }
    Admin.findOne({name: obj.name}, function (err, data) {
        if (err) {
            res.send(500);
            res.json({msg: '网络异常错误！'});
        } else if (!data) {
            res.json({msg: '2'});
        } else {
            if (obj.password == md5.aseDecode(data.password, data.name)) {
                res.json({msg: '1', user: md5.aseEncode(obj.name, 'zhoufei')});
            } else {
                res.json({msg: '3'});
            }
        }
    });
};

// isLogin  bussiness
objFun.isLoginAjax = function (req, res, next) {
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
                status: 'OK'
            });
        }
    });
}
module.exports = objFun;