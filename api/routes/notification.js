const express = require('express');
const router = express.Router();
const con = require('../../config/database');
var admin = require("firebase-admin");
const auth = require('../middlewares/requireAuth');
var serviceAccount = require("../../khedut-hisab-firebase-adminsdk-wdk5c-3a5e3949cf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post('/send_notification', (req, res) => {
  try {
    console.log(req.body);
    con.connect(function (err) {
      con.query("select fcm_token from user where fcm_token IS NOT NULL", function (err, result) {
        let tokens = [];
        let token_ = []
        result.forEach((element, index) => {
          if (element.fcm_token.length > 3)
            if (index % 400 !== 0)
              token_.push(element.fcm_token)
            else {
              if (token_.length !== 0) {
                tokens.push(token_)
                token_ = []
              }
            }
        });
        console.log(tokens);
        tokens.forEach((tokenset, iii) => {


          if (tokenset.length > 0) {
            var payload = {
              data: {
                title: req.body.title,
                body: req.body.message,
              },
              tokens: tokenset
            };
            admin.messaging().sendMulticast(payload)
              .then(function (response) {
                console.log(response);
                if (iii == 0) {
                  con.query("insert into notifications(title, message) values('" + req.body.title + "','" + req.body.message + "')  ", function (err, result) {
                    con.query("UPDATE user set is_noti_seen = 0", function (err, result) {
                      console.log(err);
                      res.send("ok")
                    })
                  })
                }

              })
              .catch(function (error) {
                console.log("Error sending message:", error);
              });
          }
        })
      });
    });

  } catch (e) {
    console.log(e);
  }
});


router.get('/set_seen', auth, (req, res) => {
  try {
    console.log("user iddddd " + req.userId);
    con.connect(function (err) {
      con.query("UPDATE user set is_noti_seen = 1 where id = " + req.userId + "", function (err, result) {

        res.send("ok")
      })
    })
  } catch (e) {

  }
});

router.get('/is_seen', auth, (req, res) => {
  try {
    console.log(req.userId);
    con.connect(function (err) {
      con.query("select is_noti_seen from user where id = " + req.userId + "", function (err, result) {
        console.log(result[0].is_noti_seen);
        res.send({ is_seen: result[0].is_noti_seen })
      })
    })
  } catch (e) {

  }
});

router.get('/get_notifications', (req, res) => {
  try {

    con.connect(function (err) {
      con.query("SELECT * FROM notifications ORDER BY id DESC limit 50", function (err, result) {
        console.log(err);
        res.status(200).send({ status: 1, Notifications: result });
      })
    })
  } catch (e) {

  }
});

router.post('/set_token', auth, (req, res) => {
  console.log("token");
  try {
    if (req.body.fcmToken.length > 3) {
      con.connect(function (err) {
        con.query("UPDATE user set fcm_token = '" + req.body.fcmToken + "' where id = " + req.userId + "", function (err, result) {
          if (err)
            console.log(err);
          else
            console.log(result);
          res.status(200);
        })
      })
    } else {
      res.status(200);
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;