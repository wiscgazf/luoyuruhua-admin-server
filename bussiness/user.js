let objFun = {};
let fs = require('fs');
let moment = require('moment');
let Promise = require('bluebird')
let Errors = require('../err/errors');

let User = require('../models/User'); // user db
let Admin = require('../models/Admin'); // admin db

/*
*
* show  page router
* */

objFun.userLogin = function (req, res, next) {  // login  page
    res.render('pc/login');
}

objFun.userRegister = function (req, res, next) {  // register  page
    res.render('pc/register');
}

/*
*
* server ajax
* */

objFun.addUserAjax = function (req, res, next) {    // add user  bussiness
    Promise.try(() => {
        return User.find({name: req.body.name});
    }).then(data => {
        if (data.length > 0) {
            res.json(Errors.userOccupied);
        } else {
            return User.create(req.body);
        }
    }).then(data => {
        res.json(Errors.addUserSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}

objFun.allUserAjax = function (req, res, next) {    // find all user business
    let reg = new RegExp(req.query.name);
    let showCount = parseInt(req.query.showCount);
    let pageMax = 0;
    let count = 0;
    Promise.try(() => {
        if (req.query.name == '') {
            return User.countDocuments();
        } else {
            return User.countDocuments({name: {$regex: reg}});
        }
    }).then(num => {
        count = num;
        let currentPage = req.query.currentPage ? req.query.currentPage : 1;
        pageMax = Math.ceil(count / showCount);

        if (currentPage >= pageMax) {
            currentPage = pageMax;
        }

        if (currentPage <= 1) {
            currentPage = 1;
        }

        let pageOffset = (currentPage - 1) * showCount;

        if (req.query.name == '') {
            return User.find({}).skip(pageOffset).limit(showCount).exec();
        } else {
            return User.find({name: {$regex: reg}}).skip(pageOffset).limit(showCount).exec();
        }
    }).then(data => {
        let user = data.map(function (item) {
            return {
                id: item._id,
                name: item.name,
                phone: item.phone,
                email: item.email,
                age: item.age,
                sex: item.sex,
                signature: item.signature,
                userImg: item.userImg,
                createTime: item.createTime,
            }
        })
        res.json({suc: '1', code: '200', count: count, pageMax: pageMax, Datas: user});
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}

objFun.userDetailAjax = function (req, res, next) { // get user detail
    User.findById(req.query.id, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json({
                suc: '1',
                code: '200',
                Data: {
                    id: data._id,
                    name: data.name,
                    password: data.password,
                    phone: data.phone,
                    email: data.email,
                    age: data.age,
                    sex: data.sex,
                    signature: data.signature,
                    userImg: data.userImg,
                }
            });
        }
    })
}
objFun.delUserAjax = function (req, res, next) {  // delete user bussiness
    User.remove({_id: req.body.id}, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            res.json(Errors.delUserSuc);
        }
    })
}

/*
*web ajax
*
* */
objFun.userRegisterAjax = function (req, res, next) {
    let registerData = req.body;
    Promise.try(() => {
        return User.find({name: registerData.name});
    }).then(data => {
        if (data.length > 0) {
            res.json(Errors.userOccupied);
        } else {
            return User.find({email: registerData.email});
        }
    }).then(data => {
        if (data.length > 0) {
            res.json(Errors.emailOccupied);
        } else {
            return User.create(registerData);
        }
    }).then(data => {
        req.session.userinfo = registerData.name;
        res.json(Errors.userRegisterSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}
module.exports = objFun;