let nodemailer = require('nodemailer');

module.exports = function (str, toEmail) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        auth: {
            user: '599803422@qq.com',
            pass: 'gzreralqcvlcybchfa' //授权码,通过QQ获取

        }
    });
    let mailOptions = {
        from: '599803422@qq.com<599803422@qq.com>', // 发送者
        to: toEmail, // 接受者,可以同时发送多个,以逗号隔开
        subject: '来自落雨如画个人博客的提醒！！！', // 标题
        // text: 'woshi  周宏宇', // 文本
        html: str,
        generateTextFromHtml: true
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('发送成功');
    });
}