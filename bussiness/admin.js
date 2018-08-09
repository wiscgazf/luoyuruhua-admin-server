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
};

objFun.adminDetailAjax = function (req, res, next) {    // adminDetail  business
    let userId = req.query.id;
    Admin.findById(userId, function (err, data) {
        if (err) {
            res.send(500);
            res.json(Errors.networkError);
        } else {
            res.json({
                msg: '1',
                code: '200',
                data: {
                    id: data._id,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    age: data.age,
                    sex: data.sex,
                    signature: data.signature,
                    userImg: data.userImg,
                    createTime: data.createTime
                }
            });
        }
    });
};

objFun.editAdminAjax = function (req, res, next) {    // editAdmin  business
    let saveUser = {};
    let adminMsg = req.body;
    console.log(adminMsg)
    /* let base64Data = userId[0].replace(/^data:image\/\w+;base64,/, "");
     let dataBuffer = new Buffer(base64Data, 'base64');*/
    /*fs.writeFile('static/upload/' + new Date().getTime() + '.png', dataBuffer, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({suc: '1'});
        }
    });*/
    Admin.findOne({_id: req.body.userId}, function (err, data) {
        if (err) {
            res.send(500);
            res.json(Errors.networkError);
        } else {
            saveUser.name = data.name;
            saveUser.phone = data.phone;
            if (saveUser.name != adminMsg.name) {
                Admin.find({name: adminMsg.name}, function (err1, data1) {
                    if (err1) {
                        res.send(500);
                        res.json(Errors.networkError);
                    } else {
                        if (data1.length > 0) {
                            res.json(Errors.nameOccupied);
                        } else {
                            if (saveUser.phone != adminMsg.phone) {
                                Admin.find({phone: adminMsg.phone}, function (err2, data2) {
                                    if (err2) {
                                        res.send(500);
                                        res.json(Errors.networkError);
                                    } else {
                                        if (data2.length > 0) {
                                            res.json(Errors.phoneregisted);
                                        } else {
                                            res.json({suc: '1'});
                                            /*Admin.update({_id: adminMsg.userId}, {$set: adminMsg}, function (err3, data3) {
                                                if (err3) {
                                                    res.send(500);
                                                    res.json(Errors.networkError);
                                                } else {
                                                    res.json(Errors.editAdminSuc);
                                                }
                                            });*/
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
};

module.exports = objFun;