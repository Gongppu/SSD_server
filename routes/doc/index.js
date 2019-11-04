const express = require('express');
const router = express.Router();

//doc read
router.use('/', require('./doc.js'));

//doc add
router.use('/add', require('./doc.js'));

//doc list get
router.use('/list', require('./list.js'));
//doc get
//router.use('/get', require('./doc_get.js'));


module.exports = router;