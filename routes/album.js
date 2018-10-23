let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/album');


// show  page router ---------------------------------------
router.get('/album', bussinessFun.albumSuc);  // album.html


/*
* server ajax
* */

/*
* web ajax
* */


module.exports = router;