// errors record
module.exports = {
    networkError: {msg: '0', code: '500', des: '网络异常错误'},
    nameOccupied: {msg: '0', code: '10001', des: '该用户名已被占用'},
    phoneregisted: {msg: '0', code: '10002', des: '该手机号已被注册'},
    twoPswSame: {msg: '0', code: '10003', des: '新密码和原密码一致，请重新输入'},
    originalPasswordErr: {msg: '0', code: '10004', des: '原密码不正确'},
    addAdminSuc: {msg: '1', code: '200', des: '添加管理员成功'},
    editAdminSuc: {msg: '1', code: '200', des: '编辑资料成功'},
    changePswSuc: {msg: '1', code: '200', des: '密码修改成功'},
    addUserSuc: {msg: '1', code: '200', des: '添加用户成功'},
    userOccupied: {msg: '0', code: '10005', des: '该用户名已存在'},
}