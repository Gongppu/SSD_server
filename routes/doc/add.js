var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');


router.get('/:user_id', async(req, res) => { //문서 추가하기
    let user_id = req.params.user_id;
    console.log(user_id);
  
    if(!user_id){ //클라에서 id 미전달
      res.status(401).send({
        message : "null value user_id"
      });
      return;
    }
    
  
      try{
        //랜덤 문자열(doc_id) 생성
        let adddocQuery = 'SELECT SUBSTR(CONCAT(MD5(RAND()),MD5(RAND())),1,36) as doc_id';
        let adddoc = await db.queryParam_None(adddocQuery);
        console.log(adddoc[0][0].doc_id);
        var doc_id =adddoc[0][0].doc_id;
  
        //문서 생성
        adddocQuery =
        'INSERT INTO ssd.doc (doc_id, user_id) VALUES (?,?)';
  
        adddoc = await db.queryParam_Arr(adddocQuery,[doc_id, user_id]);
  
        //let autoincre_Query =
        //'SELECT LAST_INSERT_ID() AS LAST'; //index 확인
        
        //let autoincre = await db.queryParam_None(autoincre_Query);
        
        //let autoid_Query =
        //'SELECT doc_id FROM ssd.doc WHERE doc_idx = (SELECT LAST_INSERT_ID())'; //랜덤 id 확인
        
        //let autoid = await db.queryParam_Arr(autoid_Query);
  
        //나중에 트리거로 생략 가능
        let addrelationQuery =
        `
        INSERT INTO ssd.user_doc (doc_id, user_id) VALUES (?,?)
        `;
        
        let addrelation = await db.queryParam_Arr(addrelationQuery,[doc_id,user_id]);
  
        res.status(201).send({
          message : "success",
          doc_id : doc_id
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