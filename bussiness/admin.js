let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let Errors = require('../err/errors');
let Others = require('../utils/others');

let Admin = require('../models/Admin'); // admin db

objFun.addAdminAjax = function (req, res, next) { // add admin ajax  bussiness
    let obj = req.body;
    Admin.find({name: obj.name}, function (err, data) {
        if (err) {
            res.send(500);
            res.json(Errors.networkError);
        } else {
            if (data.length > 0) {
                res.json(Errors.nameOccupied);
            } else {
                Admin.findOne({phone: obj.phone}, function (err, data1) {
                    if (err) {
                        res.send(500);
                        res.json(Errors.networkError);
                    } else {
                        if (data1) {
                            res.json(Errors.phoneregisted);
                        } else {
                            let createData = Object.assign(obj, {password: md5.aseEncode(obj.password, obj.name)});
                            Admin.create(createData, function (err, data2) {
                                if (err) {
                                    res.send(500);
                                    res.json(Errors.networkError);
                                } else {
                                    res.json(Errors.addAdminSuc);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

objFun.findAllAdminAjax = function (req, res, next) {      // find all admin ajax bussiness
    let obj = req.query;
    Admin.find(Others.dealObjectValue(obj), function (err, data) {
        if (err) {
            res.send(500);
            res.json(Errors.networkError);
        } else {
            if (data.length > 0) {
                res.json({
                    msg: '1',
                    code: '200',
                    res: data.map(function (item) {
                        return {
                            id: item._id,
                            name: item.name,
                            phone: item.phone,
                            email: item.email,
                            age: item.age,
                            sex: item.sex,
                            signature: item.signature,
                            userImg: item.userImg,
                            createTime: item.createTime
                        }
                    })
                });
            } else {
                res.json({msg: '0', res: []});
            }
        }
    });
}

module.exports = objFun;