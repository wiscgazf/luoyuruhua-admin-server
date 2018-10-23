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

/*
*web ajax
*
* */

module.exports = objFun;