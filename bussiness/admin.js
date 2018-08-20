let objFun = {};
let fs = require('fs');
let Promise = require("bluebird");
let md5 = require('../utils/md5');
let Errors = require('../err/errors');
let Others = require('../utils/others');

let Admin = require('../models/Admin'); // admin db

objFun.addAdminAjax = function (req, res, next) { // add admin ajax  bussiness
    let obj = req.body;
    Promise.try(() => {
        return Admin.find({name: obj.name});
    }).then(data => {
        if (data.length > 0) {
            res.json(Errors.nameOccupied);
        } else {
            return Admin.findOne({phone: obj.phone});
        }
    }).then(data => {
        if (data) {
            res.json(Errors.phoneregisted);
        } else {
            let createData = Object.assign(obj, {password: md5.aseEncode(obj.password, obj.name)});
            return Admin.create(createData);
        }
    }).then(data => {
        res.json(Errors.addAdminSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
};

objFun.findAllAdminAjax = function (req, res, next) {      // find all admin ajax bussiness
    let obj = req.query;
    let reg = new RegExp(obj.phone);
    Admin.find({phone: {$regex: reg}}, function (err, data) {
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
                                createTime: item.createTime,
                                permissions: item.permissions
                            }
                        })
                    });
                }
                else {
                    res.json({msg: '0', res: []});
                }
            }
        }
    )
}

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
                    createTime: data.createTime,
                    permissions: data.permissions
                }
            });
        }
    });
};

objFun.editAdminAjax = function (req, res, next) {    // editAdmin  business
    let baseImg = '';
    let saveUser = {};
    let adminMsg = req.body;
    Promise.try(() => {
        return Admin.findOne({_id: req.body.userId});
    }).then((data) => {
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
                let dataBuffer = Buffer.from(base64Data, 'base64');
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
        res.json(Object.assign(Errors.editAdminSuc, {user: md5.aseEncode(adminMsg.name, 'zhoufei')}));
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.changePswAjax = function (req, res, next) {  // change admin password
    let reqData = req.body;
    Promise.try(() => {
        return Admin.findById(reqData.id);
    }).then(data => {
        if (md5.aseDecode(data.password, data.name) != reqData.originalPassword) {
            res.json(Errors.originalPasswordErr);
        } else if (md5.aseDecode(data.password, data.name) == reqData.password) {
            res.json(Errors.twoPswSame);
        } else {
            return Admin.update({_id: reqData.id}, {$set: {password: md5.aseEncode(reqData.password, data.name)}});
        }
    }).then(data => {
        res.json(Errors.changePswSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    });
}

objFun.authPermissionAjax = function (req, res, next) {  // change admin password
    let reqData = req.query;
    Promise.try(() => {
        return Admin.findOne({name: md5.aseDecode(reqData.name, 'zhoufei')});
    }).then(data => {
        res.json({msg: '1', code: '200', isAuth: data.permissions});
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

module.exports = objFun;