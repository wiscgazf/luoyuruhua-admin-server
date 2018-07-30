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

module.exports = {
    getUserIp: get_client_ip,
    dealObjectValue: dealObjectValue
}