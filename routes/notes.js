let express = require('express');
let router = express.Router();
let ueditor = require('ueditor');
let bussinessFun = require('../bussiness/notes');

router.get('/notes', bussinessFun.notesList); // notes list page

router.get('/notes/:id', bussinessFun.notesDetail); // notes detail page


// ajax request --------------------------------------- server

router.post('/addthumbImg', bussinessFun.addthumbImgAjax);    // add notes thumbImg

router.post('/addNotes', bussinessFun.addNotesAjax);    // add notes api

router.get('/allNotes', bussinessFun.allNotesAjax);    // findAll notes api

router.get('/findNotes', bussinessFun.findNotesAjax);    // find notes api

router.put('/editNotes', bussinessFun.editNotesAjax);    // edit notes api

router.delete('/delNotes', bussinessFun.delNotesAjax);    // delete notes api

//ajax request ----------------------------------------- web

module.exports = router;