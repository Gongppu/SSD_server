var express = require('express');
var router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_id', async(req, res) => { //문서 리스트
  let user_id = req.params.user_id;
  console.log(user_id);

  if(!user_id || user_id=="undefined"){ //처음 접속하는 경우

    let insertidQuery =
    'INSERT INTO ssd.user(user_id) SELECT SUBSTR(CONCAT(MD5(RAND()),MD5(RAND())),1,36)';

    let insertid = await db.queryParam_None(insertidQuery);
      
    if(!insertid){
      res.status(500).send({
        message : "Internal Server Error"
      });
      return;
    }

  }
  
  let checkdocQuery =
    `
    SELECT doc_id FROM ssd.user_doc
    WHERE user_id = ?
    `;

    try{
      let checkdoc = await db.queryParam_Arr(checkdocQuery,[user_id]);
      console.log(checkdoc[0]);

      let doc_list=[];
      if(checkdoc){
        for(var i=0;i<checkdoc[0].length ; i++){
          doc_list.push(checkdoc[0][i].doc_id);
        }
      }
      res.status(201).send({
        message : "success",
        list : doc_list
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