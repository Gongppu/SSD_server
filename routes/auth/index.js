const express = require('express');
const router = express.Router();

//login
router.use('/', require('./login.js'));
//login
router.use('/temp', require('./temp.js'));

module.exports = router;