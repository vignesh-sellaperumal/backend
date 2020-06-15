const router = require('express').Router();
let Details =  require('../models/details.model');
const nodemailer = require('nodemailer');

router.route('/').get((req, res) => {
    Details.find()
        .then(details => res.json(details))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req,res) => {
    const email = req.body.email;
    const username = req.body.username;
    const about = req.body.about;
    const password = req.body.password;
    const login = req.body.login;

    const newUser = new Details({email, username, about, password, login});

    newUser.save() 
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: '+err));
        
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'trendmateapp@gmail.com',
            pass: 'V*gn#sh@456'
          }
        });
        var mailOptions = {
          to: email,
          subject: 'TrendMateApp',
          html: '<h3>Welcome to <i>Trendmate</i> family :)</h3>' 
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
});

router.route('/send').post((req, res) => {
  const email = req.body.email;
  const date = new Date();
  const shuffle = date.getTime().toString().substring(9,13);
  const message = email[0] + shuffle[0] + email[3] + shuffle[1] + email[4] + shuffle[2];
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trendmateapp@gmail.com',
      pass: 'V*gn#sh@456'
    }
  });
  var mailOptions = {
    to: email,
    subject: 'One Time Password',
    html: '<h3>Your OTP is '+message+'</h3>' 
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    Details.findOne()
        .then(details => res.json(message))
        .catch(err => res.status(400).json('Error: '+err));
  });
});
router.route('/modify/:email').post((req, res) => {
  Details.findOne({"email" : req.params.email})
      .then(detail => {
          detail.password = req.body.password;

              detail.save()
              .then(() => res.json('Password updated!'))
              .catch(err => res.status(400).json('Error: '+err));
      })
      .catch(err => res.status(400).json('Error: '+err));
});
router.route('/status/:username').post((req, res) => {
  Details.findOne({"username" : req.params.username})
      .then(detail => {
          detail.login = req.body.login;

              detail.save()
              .then(() => res.json('Status updated!'))
              .catch(err => res.status(400).json('Error: '+err));
      })
      .catch(err => res.status(400).json('Error: '+err));
});
router.route('/finduser/:username').get((req, res) => {
  Details.findOne({"username" : req.params.username})
      .then((detail) => res.json(detail))
      .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;