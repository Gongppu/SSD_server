var express = require('express');
var router = express.Router();

const db = require('../../module/pool.js');

router.get('/:id', async(req, res) => {
  let id = req.params.id;
  console.log(id);

  if(!id){
    res.status(401).send({
        message : "null value"
    });
    return;
  }
  
  let checkidQuery =
    `
    SELECT * FROM user
    WHERE usr_id = ?
  `;

  var doc_no;
    try{
      let checkid = await db.queryParam_Arr(checkidQuery,[id]);
      console.log(checkid);

      if(!checkid){ //id가 없을 때 가입
        let insertidQuery =
        'INSERT INTO ssd.user(user_id) VALUES (?)';

        let insertid = await db.queryParam_Arr(insertidQuery,[id]);
      
        if(!insertid){
          res.status(401).send({
            message : "invalid id"
          });
          return;
        }

        let autoincre_Query =
        'SELECT LAST_INSERT_ID() AS LAST'; //index 확인
        
        let autoincre = await db.queryParam_None(autoincre_Query);
        
        doc_no=autoincre[0].LAST;

      }else{
          user_no=checkid.user_no[0];  
      }
      res.status(201).send({
        message : "success",
        no : user_no
      });
    }catch(err){
      res.status(500).send({
        message : "Internal Server Error"
      });
      console.log(err);
      return;
    }
});

  
    module.exports = router;