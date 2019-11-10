const express = require('express');
const router = express.Router();



//doc add
router.use('/add', require('./add.js'));

//doc list get
router.use('/list', require('./list.js'));

//doc file add
router.use('/file', require('./file.js'));

//doc read
router.use('/', require('./doc.js'));



//doc get
//router.use('/get', require('./doc_get.js'));


module.exports = router;