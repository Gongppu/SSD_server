var express = require('express');
var router = express.Router();

const upload = require('../../config/multer.js');

router.post('/',upload.single('board_img'), async function(req, res){
   
    //파일올리기
    if(!req.file){
        res.status(400).send({
            message : "Null Value"
        }); 
    }else {
        board_img = req.file.location;
        res.status(201).send({
            message : "success",
            location : board_img
        }); 
    }
});
module.exports = router;