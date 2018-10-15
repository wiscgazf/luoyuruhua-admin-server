let objFun = {};
let fs = require('fs');
let moment = require('moment');
let Promise = require('bluebird');
let Errors = require('../err/errors');

let User = require('../models/User'); // user db
let Admin = require('../models/Admin'); // admin db

/*
*
* show  page router
* */

objFun.showreelSuc = (req, res, next) => {
    let asyncFun = async () => {
        try {
            await res.render('pc/showreel');
        }
        catch (err) {
            res.status(500).json(Errors.networkError);
        }
    }
    asyncFun();
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