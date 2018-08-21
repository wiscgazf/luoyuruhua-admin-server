let objFun = {};
let fs = require('fs');
let moment = require('moment');
let Promise = require('bluebird')
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
    let showCount = parseInt(req.query.showCount);
    let pageMax = 0;
    let count = 0;
    Promise.try(() => {
        if (req.query.name == '') {
            return User.count();
        } else {
            return User.count({name: {$regex: reg}});
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
module.exports = objFun;