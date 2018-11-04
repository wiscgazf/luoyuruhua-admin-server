let objFun = {};
let fs = require('fs');
let moment = require('moment');
let path = require('path');
let Promise = require('bluebird');
let mongoose = require('mongoose');
let Errors = require('../err/errors');

let User = require('../models/User'); // user db
let Admin = require('../models/Admin'); // admin db
let Showreel = require('../models/Showreel'); // showreel db
let Reply = require('../models/Reply'); // reply db

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

/*
*web ajax
*
* */

module.exports = objFun;