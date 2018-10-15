let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/showreel');


// show  page router ---------------------------------------
router.get('/showreel', bussinessFun.showreelSuc);

/*
* server ajax
* */


/*
* web ajax
* */


module.exports = router;