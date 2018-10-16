let express = require('express');
let router = express.Router();
let bussinessFun = require('../bussiness/showreel');


// show  page router ---------------------------------------
router.get('/showreel', bussinessFun.showreelSuc);

/*
* server ajax
* */
router.post('/addShowreelImg', bussinessFun.addShowreelImg);    // add showreel image

router.post('/addShowreel', bussinessFun.addShowreel);  //add showreel

router.get('/allShowreel', bussinessFun.allShowreel);    // showreel list

router.get('/getShowreel', bussinessFun.getShowreel);   // get showreel data

router.put('/putShowreel', bussinessFun.putShowreel);   // edit showreel

router.delete('/delShowreel', bussinessFun.delShowreel);   // delete showreel

/*
* web ajax
* */


module.exports = router;