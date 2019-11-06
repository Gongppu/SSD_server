var express = require('express');
var app=express();
var router = express.Router();
var request = require('request');

var client_id = 'ztKxe6pwd1G6_AC5aWtA';
var client_secret = 'PVMF5Q5Put';
var state = "RAMDOM_STATE";
var url="sharesdocument.ml"
var redirectURI = encodeURI("https://"+url+"/naver/callback");
var api_url = "";

router.get('/naverlogin', function (req, res) {

  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   var str = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
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
          margin-top:20px;
        }
        .login_logo{
            width: 100px;
            height: 100px;
            border: solid 1px orange;
        }
        .login_button{
          margin-top:20px;
        }
    </style>
</head>
<body>
<div class="vertical_center">
    <div class="horizontal_center">
        <div class="login_title">
            <span style="color: orange">S</span>hare
            <span style="color: orange">S</span>crap
            <span style="color: orange">D</span>ocument
        </div>

        <div class="login_detail">
            쓷 - 스크랩한 내용을 <br>
            문서로 작성하고 공유하세요!
        </div>
        <div class=login_logo_div>
        <img class=login_logo src= 'https://ssdfilebucket.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20191106_051613493.png'>
        </div>
       <a href= \"`+api_url+ `\"><img class=login_button height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>
    `;
   res.end(str);
 });

 router.get('/callback', function (req, res) {
     code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var request = require('request');
        let result=JSON.parse(body);

        var options = {
            url: "https://"+url+"/naver/member/"+result.access_token
        };
console.log(options);
        request.get(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.end("success login");
          }else{
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
          }
        });
        return;
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
});

 router.get('/member/:token', function (req, res) {

    var header="Bearer "+req.params.token;
    console.log(header);
    var api_url = 'https://openapi.naver.com/v1/nid/me';
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'Authorization': header}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var result=JSON.parse(body);
        console.log(result.response.email);
        return;

      } else {
        console.log('error');
        if(response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
        res.status(200).end();
  });
 module.exports = router;
