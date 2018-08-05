let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/admin');

// ajax request ---------------------------------------

router.post('/addAdmin', bussinessFun.addAdminAjax);    // add admin ajax

router.get('/findAllAdmin', bussinessFun.findAllAdminAjax);    // find all admin ajax

router.get('/adminDetail', bussinessFun.adminDetailAjax);    // find  admin detail ajax

module.exports = router;