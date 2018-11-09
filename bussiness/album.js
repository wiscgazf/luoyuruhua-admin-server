let objFun = {};
let fs = require('fs');
let moment = require('moment');
let md5 = require('../utils/md5');
let path = require('path');
let Promise = require('bluebird');
let mongoose = require('mongoose');
let Errors = require('../err/errors');
let otherUtil = require('../utils/others');

let User = require('../models/User'); // user db
let Admin = require('../models/Admin'); // admin db
let Showreel = require('../models/Showreel'); // showreel db
let Reply = require('../models/Reply'); // reply db
let ImgSort = require('../models/ImgSort'); // imgsort db
let Album = require('../models/Album'); // album db

/*
*
* show  page router
* */
objFun.albumSuc = function (req, res, next) {
    res.render('pc/album')
}
/*
*
* server ajax
* */

objFun.uploadImg = function (req, res, next) {
    if (req.files.length > 0) {
        res.json({
            imgArr: req.files.map(item => {
                return {
                    name: item.originalname,
                    url: '/upload/album/' + item.filename
                }
            })
        })
    }
}

objFun.thumbPhotoTypeFun = function (req, res, next) {
    let base64Data = req.body.thumbImg.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = Buffer.from(base64Data, 'base64');
    let imgName = new Date().getTime();
    fs.writeFile(path.join(__dirname, '../static/upload/album/') + imgName + '.png', dataBuffer, function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            let baseImg = '/upload/album/' + imgName + '.png';
            res.json(Object.assign(Errors.addthumbImgSuc, {thumbImg: baseImg}));
        }
    });
}

objFun.addImgTypeFun = function (req, res, next) {
    let asyncFun = async () => {
        try {
            let getAdminMsg = await Admin.findOne({name: md5.aseDecode(req.body.name, 'zhoufei')});
            let addImgKind = await ImgSort.create(Object.assign(req.body.form, {author: getAdminMsg._id}));
            return addImgKind;
        }
        catch (err) {
            res.status(500).json(Errors.networkError);
        }
    }
    asyncFun().then(data => {
        if (data) {
            res.json(Errors.addKindSuc);
        }
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}

objFun.photoAlbumFun = function (req, res, next) {
    ImgSort.find({}).populate({model: 'admin', select: 'name', path: 'author'}).exec(function (err, data) {
        if (err) {
            res.status(500).json(Errors.networkError);
        } else {
            if (data.length > 0) {
                res.json(Object.assign({Data: data}, Errors.findPhotoAlbumSuc));
            } else {
                res.json(Object.assign({Data: []}, Errors.findPhotoAlbumSuc));
            }
        }
    });
}

objFun.delPhotoFun = function (req, res, next) {
    if (otherUtil.deleteFolderRecursive(path.join(__dirname, '../static/upload/album/'), req.body.imgData)) {
        res.json(Errors.delAlbumPhotoSuc);
    } else {
        res.status(500).json(Errors.networkError);
    }
}

objFun.addImgToAlbumFun = function (req, res, next) {
    let asyncFun = async () => {
        try {
            let getAdminMsg = await Admin.findOne({name: md5.aseDecode(req.body.author, 'zhoufei')});
            let addImg = await Album.create({
                title: req.body.title,
                photoList: req.body.photoList,
                author: getAdminMsg._id,
                kind: req.body.kind
            });
            let findKind = await ImgSort.findById(req.body.kind);
            let updateImgSort = await ImgSort.update({_id: req.body.kind}, {$set: {imgNum: findKind.imgNum += req.body.photoList.length}});
            return updateImgSort;
        }
        catch (err) {
            res.json(Errors.addImgToAlbumSuc);
        }
    }
    asyncFun().then(data => {
        res.json(Errors.addImgToAlbumSuc);
    }).catch(err => {
        res.status(500).json(Errors.networkError);
    })
}
/*
*web ajax
*
* */

module.exports = objFun;