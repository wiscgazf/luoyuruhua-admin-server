let express = require('express');
let router = express.Router();
let ueditor = require('ueditor');
let bussinessFun = require('../bussiness/notes');


// ajax request ---------------------------------------
router.post('/addthumbImg', bussinessFun.addthumbImgAjax);    // add notes thumbImg

router.post('/addNotes', bussinessFun.addNotesAjax);    // add notes api
module.exports = router;