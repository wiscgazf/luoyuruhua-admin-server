let crypto = require("crypto");

// ���������㷨
const aseEncode = function (data, password) {

    // ���·���ʹ��ָ�����㷨������������cipher����
    const cipher = crypto.createCipher('aes192', password);

    // ʹ�øö����update������ָ����Ҫ�����ܵ�����
    let crypted = cipher.update(data, 'utf-8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
};

// ���������㷨
const aseDecode = function (data, password) {
    /*
     �÷���ʹ��ָ�����㷨������������ decipher����, ��һ���㷨�������������ʱ��ʹ�õ��㷨����һ��;
     �ڶ�����������ָ������ʱ��ʹ�õ����룬�����ֵΪһ�������Ƹ�ʽ���ַ�����һ��Buffer���󣬸�����ͬ����������ܸ�����ʱ��ʹ�õ����뱣��һ��
    */
    const decipher = crypto.createDecipher('aes192', password);

    /*
     ��һ������Ϊһ��Buffer�����һ���ַ���������ָ����Ҫ�����ܵ�����
     �ڶ�����������ָ��������������ʹ�õı����ʽ����ָ���Ĳ���ֵΪ 'hex', 'binary', 'base64'�ȣ�
     ��������������ָ�������������ʱʹ�õı����ʽ����ѡ����ֵΪ 'utf-8', 'ascii' �� 'binary';
    */
    let decrypted = decipher.update(data, 'hex', 'utf-8');

    decrypted += decipher.final('utf-8');
    return decrypted;
};
module.exports = {
    aseEncode: aseEncode,
    aseDecode: aseDecode
}