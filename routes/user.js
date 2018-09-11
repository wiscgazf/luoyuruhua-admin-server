let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/user');

router.get('/login', bussinessFun.userLogin); // user login page

router.get('/register', bussinessFun.userRegister); // user register page

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
router.post('/userRegister', bussinessFun.userRegisterAjax); // user register api
module.exports = router;