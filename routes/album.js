let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/album');
let Other = require('../utils/others');

// show  page router ---------------------------------------
router.get('/album', bussinessFun.albumSuc);  // album.html


/*
* server ajax
* */

// upload img to album folder
router.post('/uploadImg', Other.insertImg().array("file", 20), bussinessFun.uploadImg);

// upload img to album folder
router.post('/thumbPhotoType', bussinessFun.thumbPhotoTypeFun);

// add image kind function
router.post('/addImgType', bussinessFun.addImgTypeFun);
/*
* web ajax
* */


module.exports = router;