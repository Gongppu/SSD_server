var express = require('express');
var router = express.Router();
var fs=require('fs');

const db = require('../../module/pool.js');

router.get('/:doc_id', async(req, res) => { //문서 가져오기
  let doc_id = req.params.doc_id;
  let user_id=req.headers.user_id;

  console.log(user_id);

  if(!doc_id || !user_id){ //클라에서 id 미전달
    res.status(401).send({
      message : "null value user_id"
    });
    return;
  }
  /*doc id가 없을 경우 */
  /*doc id와 userid 가 다른 경우 */
  fs.readFile(process.cwd()+'/'+doc_id+'.txt','utf-8',function(err,data){
    if(err) throw err;
    res.status(201).send({
      message : "success",
      doc_id : doc_id,
      content : data
    });
    return;
  });
  

});

router.post('/', async(req, res) => { //문서 저장

    let user_id = req.body.user_id;
    let doc_id = req.body.doc_id;
    let doc_title = req.body.doc_title;
    let doc_body = req.body.doc_body;
    
    /* user id 랑 doc id 일치 여부 확인*/

    try{

      let updatetitleQuery =
      `
      UPDATE ssd.doc SET doc_title = ? WHERE doc_id = ?
      `;
      
      let updatetitle = await db.queryParam_Arr(updatetitleQuery,[doc_title, doc_id]);

    }catch(err){
      res.status(500).send({
        message : "Internal Server Error"
      });
      console.log(err);
      return;
    }
    //fs.open('./'+doc_id+'.txt','w',function(err,file){
    // if(err) throw err;
    //  console.log('saved!');
    //});
  var str = doc_body ;
  console.log(process.cwd()+doc_id+'.txt');
  fs.writeFile(process.cwd()+'/'+doc_id+'.txt',str,function(err){
      if(err){
        res.status(500).send({
          message : "Internal Server Error"
        });
        console.log(err);
        return;
      }
      console.log('changed!');
  });
  res.status(201).send({
    message : "success",
    doc_id : doc_id
  });
});

  module.exports = router;