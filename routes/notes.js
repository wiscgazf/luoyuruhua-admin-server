let express = require('express');
let router = express.Router();
let ueditor = require('ueditor');
let bussinessFun = require('../bussiness/notes');


// ajax request ---------------------------------------
router.post('/addthumbImg', bussinessFun.addthumbImgAjax);    // add notes thumbImg

router.post('/addNotes', bussinessFun.addNotesAjax);    // add notes api

router.get('/allNotes', bussinessFun.allNotesAjax);    // findAll notes api

router.get('/findNotes', bussinessFun.findNotesAjax);    // find notes api

router.put('/editNotes', bussinessFun.editNotesAjax);    // edit notes api
module.exports = router;