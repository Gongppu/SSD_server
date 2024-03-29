var express = require('express');
var app=express();
var router = express.Router();
var request = require('request');
const db = require('../../module/pool.js');

var state = "RAMDOM_STATE";
var url="https://sharesdocument.ml"
var redirectURI = encodeURI(url+"/naver/callback");
var api_url = "";
var client_id="PYrDW3Wffhew6I1SsTQN";
var client_secret="ZW3eohGA0D";

router.get('/naverlogin', function (req, res) {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   var str = `
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>네이버 로그인</title>
       <style>
       .vertical_center {
        position:absolute;
        top:50%; left:50%;
        transform: translate(-50%, -50%);
    }

    .horizontal_center{
        text-align: center;
    }
    .login_title{
        font-size: 26px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.19;
        letter-spacing: normal;

    }

    .login_detail{
        margin-top: 20px;
        font-size: 14px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.21;
        letter-spacing: normal;
        color: #818181;
    }
    .login_logo_div{
        margin-top:30px;
        border: none;
    }
    .login_logo{
        width: 100px;
        height: 100px;
    }
    .login_button{
        margin-top:30px;
    }

       </style>
   </head>
   <body>
   
   <div class="vertical_center">
       <div class="horizontal_center">
           <div class="login_title">
               <span style="color: #ff725f">S</span>hare
               <span style="color: #ff725f">S</span>crap
               <span style="color: #ff725f">D</span>ocument
           </div>
   
           <div class="login_detail">
               쓷- 스크랩한 내용을 <br>
               문서로 작성하고 공유하세요!
           </div>
           <div class=login_logo_div>
               <img class=login_logo src= 'https://ssdfilebucket.s3.ap-northeast-2.amazonaws.com/logo.png'>
           </div>
           <a href= \"`+api_url+ `\"><img class=login_button height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>
       </div>
   </div>
   </body>
   </html>
   `;
   res.end(str);
 });


 router.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    let result;
    request.get(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        result=JSON.parse(body);

        var header = "Bearer " + result.access_token; // Bearer 다음에 공백 추가
        console.log(header);
       var api_url = 'https://openapi.naver.com/v1/nid/me';
       var options = {
           url: api_url,
           headers: {'Authorization': header}
        };
       request.get(options, function (error, response, body) {
         if (!error && response.statusCode == 200) {
          var result=JSON.parse(body);
          console.log(result.response.email);
          var url_str =url+"/naver/temp/"+result.response.email;
          res.end("<html><meta http-equiv=\"refresh\" content=\"1; URL="+url_str+"\">succeess login</html>");
      
          res.status(200).end();
        } else {
          console.log('error');
          res.status(response.statusCode).end();
          console.log('error = ' + response);
        }
    });
        
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
    return;
});
 router.get('/temp/:token',function(req,res){
    res.end('wait please..');
 });

 router.post('/member', async function (req, res) {
    let email = req.body.email;
    let user_no=req.body.user_no;
    console.log(email+ user_no);
    try{
      //이메일 추가
    let addemailQuery =
    'UPDATE ssd.user SET user_email = ? WHERE user_no = ?';

    let addemail = await db.queryParam_Arr(addemailQuery,[email, user_no]);

    res.status(201).send({
      message : "success",
      is_true :1
    });
    res.end();
    }catch(err){
      res.status(500).send({
        message : "Internal Server Error",
        is_true : 0
      });
      console.log(err);
      return;
    }
    
  });

 module.exports = router;
