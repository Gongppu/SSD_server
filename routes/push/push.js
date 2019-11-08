const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const request = require('request');

var admin=require('firebase-admin');
var serviceAccount=require('../../config/ssdwebpush-firebase-adminsdk-xh8k4-284d050f39.json');
 
 
router.get('/', (req, res) => {  
  admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
  });
  console.log(admin);
  var fcm_target_token='cyN-TLplGKI:APA91bEHPnaayDaeojZfzhA_vFHIA9YGkX0Hy91mmvz5gv__9cajXbVHtymhff3-s8jrRySYVFsXRdGSJ819LfiCUs8qgnKqmdqCsysuD2GVd-iqbJKBiQkz8kmY9q-PfxuHkTFuZLpk';
  var fcm_message={
    notification:{
      title :'시범 데이터 발송',
      body :'클라우드 메시지 전송이 잘 되는지 확인하기 위한 메시지 입니다'
    },
    token:fcm_target_token
  }

  admin.messaging().send(fcm_message)
  .then(function(response){
    console.log('보내기 성공 '+response);
  })
  .catch(function(err){
    console.log('보내기 실패 '+err);
  })
  //  const serverKey = 'AAAATTt49_o:APA91bFpp3njZZTXqTM6VjWBw1L6tHMYl06IbF-J4N1LEbZVLVceOPoGiwYPWq81JR04aNZXlNazC8qcCuDUA_lqFgl7-R54JfQHlvxjCiA2g3coHLcqCntXyl4MhqBp7fK09GiAr4wm'; // Firebase console에서 확인한 서버키 값
  //  const auth = 'key=' + serverKey;
  
  // request.post({
  //   url: 'https://fcm.googleapis.com/fcm/send',
  //   headers: {
  //     Authorization: auth
  //   },
  //   form: {
  //     registration_id : registrationId,
  //     ['data.'+key] : text
  //   }}, function(err, respon, body) {
  //     res.send();
  //   });
    // request.post({
    //     url: 'https://fcm.googleapis.com/fcm/send',
    //     headers: {
    //       Authorization: auth
    //     },
    //     form: {
    //         "data":{
    //             "score" : "5x1",
    //             "time" : "15:10",
    //         },
    //         "to" : "eCKGCMHtaoE:APA91bEQ00QoBy2CSREeEDUb6Ew5FeGIJ0xUOOwXtkGp81tj30PRlz6O_gvbkqu1HZdaEFbHt0XV2ONVooNzHOf_PfNUnaR4ZR-QSUmQ4Qd0tcqaZ_P-XaLPqLBNb5HfJIVo7fcEDHKn"
    //     }}, function(err, respon, body) {
    //       console.log(respon);
    //     });
});

module.exports = router;