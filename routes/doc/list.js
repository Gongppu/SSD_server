var express = require('express');
var router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_id', async(req, res) => { //문서 리스트
  let user_id = req.params.user_id;
  console.log(user_id);

  if(!user_id || user_id=="undefined"){ //처음 접속하는 경우

    try{
      let insertidQuery =
      'INSERT INTO ssd.user(user_id) SELECT SUBSTR(CONCAT(MD5(RAND()),MD5(RAND())),1,36)';
  
      let insertid = await db.queryParam_None(insertidQuery);
        
      if(!insertid){
        res.status(500).send({
          message : "Internal Server Error"
        });
        return;
      }
      let automakeidQuery =
      'SELECT user_id FROM ssd.user WHERE user_no = (SELECT LAST_INSERT_ID());';
  
      let automakeid = await db.queryParam_None(automakeidQuery);
        
      if(!automakeid){
        res.status(500).send({
          message : "Internal Server Error"
        });
        return;
      }
      
      user_id=automakeid[0][0].user_id;
      
    }catch(err){
      res.status(500).send({
        message : "Internal Server Error"
      });
      console.log(err);
      return;
    }
    
  }
  
  let checkdocQuery =
    `
    SELECT d.doc_id, d.doc_title, ud.is_share 
    FROM ssd.doc as d , ssd.user_doc as ud 
    WHERE d.doc_idx=ud.doc_idx AND d.user_id = ?
    `;

    try{
      let checkdoc = await db.queryParam_Arr(checkdocQuery,[user_id]);

      let doc_list=[];
      if(checkdoc){
        for(var i=0;i<checkdoc[0].length ; i++){
          var doc_obj={
            doc_id : checkdoc[0][i].doc_id,
            doc_title : checkdoc[0][i].doc_title,
            doc_is_share : checkdoc[0][i].is_share
          };
          
          doc_list.push(doc_obj);
        }
      }
      res.status(201).send({
        message : "success",
        user_id : user_id,
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