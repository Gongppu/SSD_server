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


module.exports = router;