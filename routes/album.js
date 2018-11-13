let express = require('express');
let router = express.Router();
let path = require('path');
let bussinessFun = require('../bussiness/album');
let Other = require('../utils/others');

// show  page router ---------------------------------------
router.get('/album', bussinessFun.albumSuc);  // album.html

router.get('/album/:id', bussinessFun.albumList);    // albumList.html
/*
* server ajax
* */

// upload img to album folder
router.post('/uploadImg', Other.insertImg(path.join(__dirname, '../static/upload/album/')).array("file", 20), bussinessFun.uploadImg);

// upload img to album folder
router.post('/thumbPhotoType', bussinessFun.thumbPhotoTypeFun);

// add image kind function
router.post('/addImgType', bussinessFun.addImgTypeFun);

// find photo album
router.get('/photoAlbum', bussinessFun.photoAlbumFun);

//  delete uploaded image
router.delete('/delPhoto', bussinessFun.delPhotoFun);

//  add album image
router.post('/addImgToAlbum', bussinessFun.addImgToAlbumFun);
/*
* web ajax
* */


module.exports = router;