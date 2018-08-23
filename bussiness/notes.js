let objFun = {};
let fs = require('fs');
let Promise = require("bluebird");
let moment = require('moment');
let Errors = require('../err/errors');

let Admin = require('../models/Admin'); // admin db
let User = require('../models/User'); // user db
let Notes = require('../models/Notes'); // admin db

module.exports = objFun;