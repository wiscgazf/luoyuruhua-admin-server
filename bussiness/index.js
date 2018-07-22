let objFun = {};
let fs = require('fs');

// admin db
let Admin = require('../models/Admin');

// index page
objFun.indexSuc = function (req, res, next) {
    req.session.userMsg = '123';
    res.render('index', {title: '123'})
};

// ajax bussiness  -------------------------

// login  bussiness
objFun.loginAjax = function (req, res, next) {
    console.log(req.session)
    let obj = {
        name: req.body.name,
        password: req.body.password
    };
    Admin.findOne({name: obj.name}, function (err, data) {
        if (err) {
            res.send(500);
            res.json({msg: '网络异常错误！'});
        } else if (!data) {
            res.json({msg: '-1'});
        } else {
            if (obj.password == data.password) {
                req.session.userMsg = JSON.stringify(obj);
                res.json({msg: '1'});
            } else {
                res.json({msg: '0'});
            }
        }
    });
};


module.exports = objFun;