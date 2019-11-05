var express = require('express');
var app=express();
var router = express.Router();

var client_id = 'n5L6cIX3kIJmf3CoR0hW';
var client_secret = 'Nd43kUpV7M';
var state = "RAMDOM_STATE";
var url="sharesdocument.ml"
var redirectURI = encodeURI("https://"+url+"/naver/callback");
var api_url = "";

router.get('/naverlogin', function (req, res) {
  console.log("sdc");
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
    }
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        //res.end(body);
        let result=JSON.parse(body);
        
        var option={
            url: 'http://'+url+':3006/naver/member',
            headers: {'access_token':result.access_token}    
        }
        request.get(option,function(error,response,body){
            if(!error && response.statusCode == 201){
              
              res.end(body);
              

            }else{
                res.end("internal server error");
            }
        });
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
 });
 router.get('/member', function (req, res) {
  
    var header="Bearer "+req.headers.access_token;
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
        console.log(result.response.name);
        res.status(201).send({
            message : 'success',
            name : result.response.name
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