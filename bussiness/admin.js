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
    let baseImg = '';
    let saveUser = {};
    let adminMsg = req.body;
    Admin.findOne({_id: req.body.userId}).then((data) => {
        saveUser.name = data.name;
        saveUser.phone = data.phone;
        saveUser.password = data.password;
        return Admin.find({name: adminMsg.name});
    }).then((data) => {
        if (data.length > 1 || (data.length == 1 && saveUser.name != data[0].name)) {
            res.json(Errors.nameOccupied);
        } else {
            return Admin.find({phone: adminMsg.phone});
        }
    }).then((data) => {
        if (data.length > 1 || (data.length == 1 && saveUser.phone != data[0].phone)) {
            res.json(Errors.phoneregisted);
        } else {
            if (/^data:image\/(jpeg|png|gif);base64,/.test(adminMsg.imgUrl)) {  // The image of parsing base64 is saved in the '__dirname\static\upload' folder
                let base64Data = adminMsg.imgUrl.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile('static/upload/' + adminMsg.userId + '.png', dataBuffer, function (err, data) {
                    if (err) {
                        res.status(500).json(Errors.networkError);
                    } else {
                        baseImg = '/static/upload/' + adminMsg.userId + '.png';
                        updateAdmin(res, adminMsg, baseImg, adminMsg.userId, saveUser);
                    }
                });
            } else {
                baseImg = adminMsg.imgUrl;
                updateAdmin(res, adminMsg, baseImg, adminMsg.userId, saveUser);
            }
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
};

// update admin message
function updateAdmin(res, adminMsg, portrait, id, saveUser) {
    delete adminMsg.imgUrl;
    delete adminMsg.userId;
    adminMsg.userImg = portrait;
    Admin.update({_id: id}, {$set: Object.assign(adminMsg, {password: md5.aseEncode(md5.aseDecode(saveUser.password, saveUser.name), adminMsg.name)})}).then(data => {
        console.log(data);
        res.json(Object.assign(Errors.editAdminSuc, {user: md5.aseEncode(adminMsg.name, 'zhoufei')}));
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

module.exports = objFun;