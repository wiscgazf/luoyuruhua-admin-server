let md5 = require('md5');

module.exports = function (val) {
    let newStr = 'yswx' + val + 'ysjhacc';
    return md5(newStr);
}