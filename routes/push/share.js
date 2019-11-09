var express = require('express');
var router = express.Router();
var fs=require('fs');

const db = require('../../module/pool.js');

router.get('/:doc_id', async(req, res) => { //공유하고 있는 멤버 리스트
    let doc_id = req.params.doc_id;
  
    if(!doc_id){ //클라에서 id 미전달
      res.status(401).send({
        message : "null value"
      });
      return;
    }

      try{
        
        //공유하고 있는 멤버 리스트
        let knowidxQuery = 'SELECT doc_idx FROM ssd.doc WHERE doc_id = ?';
        let knowidx=await db.queryParam_Arr(knowidxQuery,[doc_id]);
        
        let shareuserlistQuery = 'SELECT user_email FROM ssd.user WHERE user_no IN (SELECT user_idx FROM ssd.user_doc WHERE doc_idx = ?)';
        let shareuserlist = await db.queryParam_Arr(shareuserlistQuery,[knowidx[0][0].doc_idx]);
   
        let doctitleQuery = 'SELECT doc_title FROM ssd.doc WHERE doc_id = ?';
        let doctitle = await db.queryParam_Arr(doctitleQuery,[doc_id]);
        console.log(shareuserlist[0]);
        res.status(201).send({
          message : "success",
          doc_title : doctitle[0][0].doc_title,
          user_list : shareuserlist[0]
        });
          
      }catch(err){
        res.status(500).send({
          message : "Internal Server Error"
        });
        console.log(err);
        return;
      }
});

router.post('/', async(req, res) => { //멤버 초대
    let user_list = JSON.parse(req.body.invite_list);
    let doc_id=req.body.doc_id;

    console.log(user_list[0]);
  
    if(!doc_id || ! Array.isArray(user_list)){ //클라에서 id 미전달
      res.status(401).send({
        message : "null value"
      });
      return;
    }

      try{
        
        //공유할 유저 찾기
        let selectuserQuery = 'SELECT user_no FROM ssd.user WHERE user_email = ?';
         
        //공유할 사람 삽입
        let shareuserQuery = 'INSERT INTO ssd.user_doc (doc_idx, user_idx) VALUES (?,?)';
        let selectuser;
        let shareuser;
        var share_check=0;
        for(var i=0;i<user_list.length;i++){
            selectuser = await db.queryParam_Arr(selectuserQuery,[user_list[i]]);
            
            if(selectuser[0][0]){
                let knowidxQuery = 'SELECT doc_idx FROM ssd.doc WHERE doc_id = ?';
                let knowidx=await db.queryParam_Arr(knowidxQuery,[doc_id]);
                share_check++;
                shareuser = await db.queryParam_Arr(shareuserQuery,[knowidx[0][0].doc_idx, selectuser[0][0].user_no]);
            }
        }
        if(share_check>0){
            let updateshareQuery =
            `
            UPDATE ssd.doc SET is_share = 1 WHERE doc_id = ?
            `;
            
            let updateshare = await db.queryParam_Arr(updateshareQuery,[doc_id]);

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


module.exports = router;