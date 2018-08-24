let objFun = {};
let fs = require('fs');
let md5 = require('../utils/md5');
let Promise = require("bluebird");
let moment = require('moment');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db
let User = require('../models/User'); // user db
let Notes = require('../models/Notes'); // admin db

objFun.addthumbImgAjax = function (req, res, next) {    // add notes thumbImg  bussiness
    let base64Data = req.body.thumbImg.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = Buffer.from(base64Data, 'base64');
    var imgName = new Date().getTime();
    fs.writeFile('static/upload/notes/' + imgName + '.png', dataBuffer, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            let baseImg = '/static/upload/notes/' + imgName + '.png';
            res.json(Object.assign(Errors.addthumbImgSuc, {thumbImg: baseImg}));
        }
    });
}

objFun.addNotesAjax = function (req, res, next) {
    let notesData = req.body;
    /*Notes.find().populate({path: 'author', model: 'admin'}).exec(function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            console.log(data)
            res.json({suc: '1'});
        }
    })*/
    Promise.try(() => {
        return Admin.findOne({name: md5.aseDecode(notesData.name, 'zhoufei')});
    }).then(data => {
        console.log(data._id)
        return Notes.create(Object.assign(notesData.form, {
            createTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            updateTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            author: data._id
        }))
    }).then(data => {
        res.json(Errors.addNotesSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}


module.exports = objFun;