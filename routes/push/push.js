var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');


router.post('/', async(req, res) => { //알람 보낼 유저 선택
    let user_list = JSON.parse(req.body.user_list);
    let doc_id=req.body.doc_id;
    console.log(user_list[0]);
    if(!user_list || !doc_id){ //클라에서 id 미전달
      res.status(401).send({
        message : "null value"
      });
      return;
    }

      try{
        //문서 인덱스
        let knowidxQuery = 'SELECT doc_title FROM ssd.doc WHERE doc_id = ?';
        let knowidx=await db.queryParam_Arr(knowidxQuery,[doc_id]);
        
        //알람 보낼 사람 입력
        let usernoQuery = 'INSERT INTO ssd.alarm (doc_title, user_no) VALUES (?,?)';
        let userno;
        for(var i=0;i<user_list.length;i++){
          userno = await db.queryParam_Arr(usernoQuery,[knowidx[0][0].doc_title, user_list[i]]);
        }
  
        res.status(201).send({
          message : "success"
        });
          
      }catch(err){
        res.status(500).send({
          message : "Internal Server Error"
        });
        console.log(err);
        return;
      }
    });
  
  router.get('/:user_no', async(req, res) => { 
    let user_no = req.params.user_no;
  
    if(!user_no){ //클라에서 id 미전달
      res.status(401).send({
        message : "null value"
      });
      return;
    }

      try{
        //알람 온것이 있는지
        let alarmQuery = 'SELECT doc_title FROM ssd.alarm WHERE user_no = ?';
        let alarm = await db.queryParam_Arr(alarmQuery,[user_no]);

        let title;
        let doc_id;
        if(alarm[0][0]){
        
          let deletealarmQuery = 'DELETE FROM ssd.alarm WHERE doc_title = ? AND user_no = ?';
          let deletealarm = await db.queryParam_Arr(deletealarmQuery,[alarm[0][0].doc_title, user_no]);
        
        }
        res.status(201).send({
          message : "success",
          doc_title : alarm[0][0].doc_title,
          doc_id : doc_id
        });
          
      }catch(err){
        res.status(500).send({
          message : "Internal Server Error",

        });
        console.log(err);
        return;
      }
  });
    
  module.exports = router;