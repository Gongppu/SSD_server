var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

// auth
router.use('/auth', require('./auth/index.js'));

// naver login
router.use('/naver', require('./naver/index.js'));

// doc
router.use('/doc', require('./doc/index.js'));


// push
//router.use('/push', require('./push/push.js'));

// google
//router.use('/google', require('./google/index.js'));


module.exports = router;
