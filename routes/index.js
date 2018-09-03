let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/index');

router.get('/', bussinessFun.indexSuc); // index page


// ajax request ---------------------------------------

router.post('/login', bussinessFun.loginAjax);  // login ajax

router.post('/isLogin', bussinessFun.isLoginAjax);  // isLogin ajax

router.get('/getClientMsg', bussinessFun.getClientMsg); // clientMsg ajax

module.exports = router;