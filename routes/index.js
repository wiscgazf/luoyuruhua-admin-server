let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/index');

// index page
router.get('/', bussinessFun.indexSuc);

// ajax request ---------------------------------------

// login ajax
router.post('/login', bussinessFun.loginAjax);


module.exports = router;