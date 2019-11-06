var express = require('express');
var router = express.Router();
var fs=require('fs');

router.get('/template', function(req, res){
    fs.open('./temp.txt','w',function(err,file){
        if(err) throw err;
        console.log('saved!');
    });
    var str = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          coding
        </ul>
    </body>
  </html>`;
    fs.writeFile('./temp.txt',str,function(err){
        if(err) throw err;
        console.log('changed!');
    });
});
router.get('/', function(req, res){
    res.send('Hello home page');;
});
router.get('/dynamic', function(req, res){
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          ${lis}
        </ul>
        ${time}
    </body>
  </html>`;
  res.send(output);
});  

router.get('/ip',function(req, res){
  console.log("asdf");
var api_url='sdf';
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

        .login_logo{
            width: 100px;
            height: 100px;
            border: solid 1px orange;
            margin-top: 40px;
        }

        .login_naver{
            margin-top: 20px;
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
        <img class=login_logo src= 'https://ssdfilebucket.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20191106_051613493.png'>

       <a href= \"`+api_url+ `\"><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>
    `;
   res.send(str);
});
module.exports = router;