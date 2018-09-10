let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/user');

router.get('/login', bussinessFun.userLogin);

// ajax request ---------------------------------------

/*
* server ajax
* */
router.post('/addUser', bussinessFun.addUserAjax);   // add user  api

router.get('/allUser', bussinessFun.allUserAjax);   // find all user api

router.get('/userDetail', bussinessFun.userDetailAjax);   // get user detail api

router.delete('/delUser', bussinessFun.delUserAjax);   // delete user api

/*
* web ajax
* */

module.exports = router;