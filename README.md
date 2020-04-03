# SSD_server

#### ```TAB으로 웹브라우저를 이동할 필요 없이 내 생각을 한번에 정리하자 ```


*웨일브라우저에서는 하나의 창에서 아래의 작업을 전부 할 수 있다*
<img src="https://user-images.githubusercontent.com/37530599/78291463-66c94c80-7560-11ea-9813-4dc7f945c175.png" width="65%" height="65%"></img>


## Using
###### BackEnd
* Node.js
* express.js
* AWS infra(RDS, EC2, SSL, S3)
* RestFul API ```JSON 형식으로 End Point에 뿌려줌.```
* ```var cors = require('cors'); app.use(cors());``` 로 cors 설정

* 네이버 아이디로 로그인 API

</br></br>
## Screen Shots
<img src="https://user-images.githubusercontent.com/37530599/78291097-c1ae7400-755f-11ea-950c-08c4fbddcb9e.png" width="60%"></img>
<hr>
<img src="https://user-images.githubusercontent.com/37530599/78291118-cecb6300-755f-11ea-83f7-17b12951e396.png" width="60%"></img>
<hr>
<img src="https://user-images.githubusercontent.com/37530599/78291128-d4c14400-755f-11ea-8949-79ed65938616.png" width="60%"></img>
<hr>

## Setting
**config/ 폴더 생성 후, 아래의 4개 파일**

1. dbPool.js
```node.js
var mysql = require('promise-mysql')

const dbConfig = {
    host : '',
    port : '',
    user : '',
    password : '',
    database : '',
    connectionLimit : 20
 };

module.exports = mysql.createPool(dbConfig);
```

2. awsConfig.json
```node.js
{
	"accessKeyId": "",
	"secretAccessKey" : "",
	"region" : "ap-northeast-2"
}
```

3. multer.js
```node.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: '',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

module.exports = upload;
```

4. secretKey.js
```node.js
module.exports = {
    secret : "(Anykey you want)"
}
```

</br></br>
## Build
```
git clone https://github.com/Weatherook/server
cd server
npm config package-lock false //package-lock 생성 못하게 필요시에
npm start
```

*integrity checksum failed 오류가 나는 경우* **npm cache clean --force 실행**

</br></br>
## Nginx 설정
**웹서버 접속 후, 진행**
1. sudo apt update -y && sudo apt-get install nginx -y
</br>
2. sudo systemctl status nginx
</br>
3. sudo systemctl start nginx , sudo systemctl enable nginx
</br>
4. Nginx 설정파일 수정 ```sudo vi /etc/nginx/sites-available/defalut```

```javascript
server{
	listen 8080;
	sever_name ip;
	location /{
	 proxy_pass http://ip:포트번호;
	 proxy_http_version 1.1;
	 proxy_set_header Upgrade $http_upgrade;
	 proxy_set_header Connection 'upgrade';
	 proxy_set_header Host $host;
	 proxy_cache_bypass $http_upgrade;
	}
	location /public{
	 root /usr/loca/var/www;
	}
     } 
server {
      listen 80;

      server_name ip;

      ## redirect http to https ##
      rewrite (path 정규식 표현으로);

}
```
</br>
5. sudo service nginx restart
</br>

### ~~Find Me~~ 
<img src="https://user-images.githubusercontent.com/37530599/78291155-dc80e880-755f-11ea-8839-08a79951c487.png" width="30%"></img>
