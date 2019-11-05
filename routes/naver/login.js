var express = require('express');
var app=express();
var router = express.Router();
var request = require('request');

var client_id = 'n5L6cIX3kIJmf3CoR0hW';
var client_secret = 'Nd43kUpV7M';
var state = "RAMDOM_STATE";
var url="sharesdocument.ml"
var redirectURI = encodeURI("https://"+url+"/naver/callback");
var api_url = "";

router.get('/naverlogin', function (req, res) {

  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
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
        request.get(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.end("로그인 성공하였습니다.");
          }else{
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
          }
        });
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
        res.status(200).send({
            message : 'success'
        });

        return;
      } else {
        console.log('error');
        if(response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  });
 module.exports = router;