let objFun = {};
let fs = require('fs');
let moment = require('moment');
let Errors = require('../err/errors');

let User = require('../models/User'); // admin db

objFun.addUserAjax = function (req, res, next) {    // add user  bussiness
    async function createUser() {
        return await User.create(req.body);
    }

    createUser().then(data => {
        res.json(Errors.addUserSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}

objFun.allUserAjax = function (req, res, next) {    // find all user business
    let reg = new RegExp(req.query.name);

    async function findAllUser() {
        if (req.query.name == '') {
            return await User.find();
        } else {
            return await User.find({name: {$regex: reg}});
        }
    }

    findAllUser().then(data => {
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
        res.json({suc: '1', code: '200', Datas: user});
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}
module.exports = objFun;