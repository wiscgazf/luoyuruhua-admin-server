module.exports = function (phone, resFun) {
    let randNum = '';
    for (var i = 0; i < 4; i++) {
        randNum += Math.floor(Math.random() * 10)
    }
    const SMSClient = require('@alicloud/sms-sdk');
    // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
    const accessKeyId = ''
    const secretAccessKey = ''
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: '周飞',
        TemplateCode: 'SMS_137950107',
        TemplateParam: '{"code":"' + randNum + '"}'
    }).then(function (res) {
        let {Code} = res;
        if (Code === 'OK') {
            //处理返回参数
            console.log(res);
            resFun.json({success: true});

        }
    }, function (err) {
        console.log(err)
    })
}