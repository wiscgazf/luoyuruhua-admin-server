let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/user');

// ajax request ---------------------------------------

router.post('/addUser', bussinessFun.addUserAjax);   // add user  api

router.get('/allUser', bussinessFun.allUserAjax);   // find all user api

router.get('/userDetail', bussinessFun.userDetailAjax);   // get user detail

module.exports = router;