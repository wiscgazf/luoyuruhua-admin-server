let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/album');
let Other = require('../utils/others');

// show  page router ---------------------------------------
router.get('/album', bussinessFun.albumSuc);  // album.html


/*
* server ajax
* */
router.post('/uploadImg', Other.insertImg().array("file", 20), bussinessFun.uploadImg);
/*
* web ajax
* */


module.exports = router;