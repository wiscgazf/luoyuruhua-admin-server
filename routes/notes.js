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

router.get('/getCommentData', bussinessFun.getCommentDataAjax);    // server get comments list api

router.delete('/deleteComment', bussinessFun.deleteCommentDataAjax);    // server delete comments list api

//ajax request ----------------------------------------- web
router.post('/addComment', bussinessFun.addCommentAjax)  // add comments

router.get('/getComment', bussinessFun.getCommentAjax) // get comments


module.exports = router;