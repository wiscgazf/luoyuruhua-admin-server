let nodemailer = require('nodemailer');

module.exports = function (str) {
    let transporter = nodemailer.createTransport({
        host: 'qq',
        auth: {
            user: '599803422@qq.com',
            pass: '' //授权码,通过QQ获取

        }
    });
    let mailOptions = {
        from: '599803422@qq.com<599803422@qq.com>', // 发送者
        to: '<wiscgazf@163.com>', // 接受者,可以同时发送多个,以逗号隔开
        subject: '这是周飞发送给您的邮件！', // 标题
        // text: 'woshi  周洪宇', // 文本
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