let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let Errors = require('../err/errors');

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

module.exports = objFun;