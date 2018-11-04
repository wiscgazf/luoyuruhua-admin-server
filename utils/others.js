let fs = require('fs');
let path = require('path');
let multer = require("multer");

let get_client_ip = function (req) {    // 获取用户的IP
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip;
};

function find(str, cha, num) {
    var x = str.indexOf(cha);
    for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
    }
    return x;
}

function dataType(obj) {
    if (obj === null) return "Null";
    if (obj === undefined) return "Undefined";
    return Object.prototype.toString.call(obj).slice(8, -1);
};

function dealObjectValue(obj) { // 过滤对象的属性值为null或者undefined
    var param = {};
    if (obj === null || obj === undefined || obj === "") return param;
    for (var key in obj) {
        if (dataType(obj[key]) === "Object") {
            param[key] = dealObjectValue(obj[key]);
        } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
            param[key] = obj[key];
        }
    }
    return param;
};

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
        return true;
    } else if (isExists) {     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}

function ltTenFun(num) {
    if (num > 10) {
        return num;
    } else {
        return '0' + num;
    }
}

function insertImg() { //多图上传
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../static/upload/album/'));
        },
        filename: function (req, file, cb) {
            var str = file.originalname.split('.');
            cb(null, Date.now() + '.' + str[1]);
        }
    });

    return multer({storage: storage});
}

module.exports = {
    getUserIp: get_client_ip,
    dealObjectValue: dealObjectValue,
    dirExists: dirExists,
    ltTenFun: ltTenFun,
    insertImg: insertImg
}