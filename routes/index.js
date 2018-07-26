let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/index');

// index page
router.get('/', bussinessFun.indexSuc);

// ajax request ---------------------------------------

// login ajax
router.post('/login', bussinessFun.loginAjax);

// isLogin ajax
router.post('/isLogin', bussinessFun.isLoginAjax);

// clientMsg ajax
router.get('/getClientMsg', bussinessFun.getClientMsg);

module.exports = router;