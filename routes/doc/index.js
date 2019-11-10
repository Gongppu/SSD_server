const express = require('express');
const router = express.Router();



//doc add
router.use('/add', require('./add.js'));

//doc list get
router.use('/list', require('./list.js'));

//doc list get
router.use('/file', require('./file.js'));

//doc read
router.use('/', require('./doc.js'));


module.exports = router;