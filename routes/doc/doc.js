var express = require('express');
var router = express.Router();
var fs=require('fs');

const db = require('../../module/pool.js');

router.get('/:doc_id/:user_no', async(req, res) => { //문서 가져오기
  let doc_id = req.params.doc_id;
  let user_no=req.params.user_no;
  var gettitle;
  console.log(user_no);

  if(!doc_id){ //클라에서 id 미전달
    res.status(401).send({
      message : "null value user_id"
    });
    return;
  }
  try{

    let gettitleQuery =
    `
    SELECT is_open, doc_img, doc_title, todo_count, toggle_count FROM ssd.doc WHERE doc_id =?
    `;
    
    let gettitle = await db.queryParam_Arr(gettitleQuery,[doc_id]);
    

    if(gettitle[0][0].is_open=='' || gettitle[0][0].is_open != user_no){
      res.status(201).send({
        message : "denied"
      });
      return;
    }else{
        let updateidQuery =
        `
        UPDATE ssd.doc SET is_open = ? WHERE doc_id = ?
        `;
        
        let updateopen = await db.queryParam_Arr(updateidQuery,[user_id,doc_id]);
    
    }
   
  }catch(err){
    res.status(500).send({
      message : "Internal Server Error"
    });
    console.log(err);
    return;
  }

  /*doc id가 없을 경우 */
  /*doc id와 userid 가 다른 경우 */
  fs.readFile(process.cwd()+'/'+doc_id+'.txt','utf-8',function(err,data){
    if(err) throw err;
    res.status(201).send({
      message : "success",
      doc_id : doc_id,
      is_open : gettitle[0][0].is_open,
      doc_img : gettitle[0][0].doc_img,
      doc_title : gettitle[0][0].doc_title,
      todo_count : gettitle[0][0].todo_count,
      toggle_count : gettitle[0][0].toggle_count,
      content : data
    });
    return;
  });
  

});

router.post('/', async(req, res) => { //문서 저장

    let user_id = req.body.user_id;
    let doc_img = req.body.doc_img;
    let doc_id = req.body.doc_id;
    let doc_title = req.body.doc_title;
    let todo_count = req.body.todo_count;
    let toggle_count = req.body.toggle_count;
    let doc_body = req.body.doc_body;
    
    /* user id 랑 doc id 일치 여부 확인*/

    if(!user_id || !doc_id || !doc_title || !todo_count || !toggle_count ){
      res.status(401).send({
        message : "no value"
      });
      return;
    }
    try{
      let updatetitleQuery;
      let updatetitle;
      if(doc_img){
        updatetitleQuery =
        `
        UPDATE ssd.doc SET doc_title = ? , todo_count = ?, toggle_count = ?, doc_img = ? WHERE doc_id = ?
        `;
        
        updatetitle = await db.queryParam_Arr(updatetitleQuery,[doc_title, todo_count, toggle_count, doc_img, doc_id]);
  
      }else{

        updatetitleQuery =
        `
        UPDATE ssd.doc SET doc_title = ? , todo_count = ?, toggle_count = ? WHERE doc_id = ?
        `;
        
        updatetitle = await db.queryParam_Arr(updatetitleQuery,[doc_title, todo_count, toggle_count, doc_id]);
  
      }
      
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

router.delete('/:doc_id',async(req, res) => { //문서 삭제
  let doc_id = req.params.doc_id;
  //let user_id=req.headers.user_id;

  /* user id 랑 doc id 일치 여부 확인*/

  try{
    fs.unlink(process.cwd()+'/'+doc_id+'.txt', function(err){
      if(err){
        res.status(500).send({
          message : "Internal Server Error"
        });
        console.log(err);
        return;
      }
    });
    let deletedocQuery =
    `
    DELETE FROM ssd.doc WHERE doc_id = ?
    `;
    
    let deletedoc = await db.queryParam_Arr(deletedocQuery,[doc_id]);

    res.status(201).send({
      message : "success"
    });
    return;

  }catch(err){
    res.status(500).send({
      message : "Internal Server Error"
    });
    console.log(err);
    return;
  }
});

module.exports = router;
